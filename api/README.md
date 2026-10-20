# Free LLM API

OpenAI-compatible API on Cloudflare Workers AI (free plan).

## Deploy (one time)
1. Create a free Cloudflare account; enable Workers AI.
2. Create an API token from the "Edit Cloudflare Workers" template.
3. In this GitHub repo, add secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `API_KEYS` (comma-separated, e.g. `sk-free-<random>`).
4. Push to `cloud-models` (or run the "Deploy API" workflow). URL: `https://free-llm-api.<your-subdomain>.workers.dev`

## Use
    curl https://free-llm-api.<sub>.workers.dev/v1/chat/completions \
      -H "Authorization: Bearer sk-free-xxxx" -H "Content-Type: application/json" \
      -d '{"model":"llama-8b","messages":[{"role":"user","content":"Hello"}]}'
