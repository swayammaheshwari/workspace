// OpenAI-compatible gateway in front of Cloudflare Workers AI.
const MODELS = {
  "llama-8b": "@cf/meta/llama-3.1-8b-instruct",
  "llama-3b": "@cf/meta/llama-3.2-3b-instruct",
};
const DEFAULT_MODEL = "llama-8b";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-allow-methods": "GET, POST, OPTIONS",
};

const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...CORS, ...extra },
  });

const error = (status, message, type = "invalid_request_error") =>
  json({ error: { message, type } }, status);

function authorized(request, env) {
  const keys = (env.API_KEYS || "").split(",").map((k) => k.trim()).filter(Boolean);
  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return keys.length > 0 && keys.includes(token);
}

async function chat(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return error(400, "Body must be valid JSON");
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return error(400, "`messages` must be a non-empty array");
  }

  const alias = body.model || DEFAULT_MODEL;
  const model = MODELS[alias];
  if (!model) return error(400, `Unknown model "${alias}". See GET /v1/models`);

  const cap = Number(env.MAX_TOKENS_CAP) || 512;
  const max_tokens = Math.min(Number(body.max_tokens) || 256, cap);
  const stream = body.stream === true;
  const id = `chatcmpl-${crypto.randomUUID()}`;
  const created = Math.floor(Date.now() / 1000);

  let result;
  try {
    result = await env.AI.run(model, {
      messages: body.messages,
      max_tokens,
      temperature: body.temperature,
      stream,
    });
  } catch (e) {
    return error(503, `Model unavailable (free quota may be used up): ${e.message}`, "server_error");
  }

  if (stream) {
    // Workers AI emits SSE like `data: {"response":"tok"}`; re-wrap as OpenAI chunks.
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";
    const out = new TransformStream({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            continue;
          }
          try {
            const { response } = JSON.parse(data);
            const payload = {
              id, object: "chat.completion.chunk", created, model: alias,
              choices: [{ index: 0, delta: { content: response ?? "" }, finish_reason: null }],
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
          } catch { /* ignore partial line */ }
        }
      },
    });
    return new Response(result.pipeThrough(out), {
      headers: { "content-type": "text/event-stream", "cache-control": "no-cache", ...CORS },
    });
  }

  return json({
    id, object: "chat.completion", created, model: alias,
    choices: [{
      index: 0,
      message: { role: "assistant", content: result.response ?? "" },
      finish_reason: "stop",
    }],
    usage: result.usage ?? { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
  });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (pathname === "/health") return json({ ok: true });

    if (pathname.startsWith("/v1/")) {
      if (!authorized(request, env)) return error(401, "Invalid or missing API key", "authentication_error");

      if (pathname === "/v1/models" && request.method === "GET") {
        return json({ object: "list", data: Object.keys(MODELS).map((id) => ({ id, object: "model", owned_by: "cloudflare" })) });
      }
      if (pathname === "/v1/chat/completions" && request.method === "POST") {
        return chat(request, env);
      }
    }
    return error(404, "Not found");
  },
};
