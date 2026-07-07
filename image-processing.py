from mlx_vlm import load, generate

model, processor = load(
    "mlx-community/SmolVLM2-500M-Video-Instruct-mlx"
)

response = generate(
    model,
    processor,
    image="assets/openapi_logo.jpg",
    prompt="<image>\nWhat is in this image?"
)

print(response)