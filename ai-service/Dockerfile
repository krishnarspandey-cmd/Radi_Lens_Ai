# Hugging Face Spaces Compatible Dockerfile
FROM python:3.10-slim

# Set environment variables for Hugging Face caching and port
ENV HOST=0.0.0.0
ENV PORT=7860
ENV HF_HOME=/tmp/.cache/huggingface
ENV MODEL_DIR=/app/ai_models

# Create user to run the app securely (Hugging Face requires a non-root user)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Switch back to root temporarily to install system dependencies
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Fix permissions for the cache directory
RUN mkdir -p /tmp/.cache/huggingface && chown -R 1000:1000 /tmp/.cache/huggingface && chmod -R 777 /tmp/.cache/huggingface

# Switch back to the non-root user
USER user

# Install Python requirements natively
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Copy the entire app code
COPY --chown=user . .

EXPOSE 7860

# Launch the FastAPI app serving on Port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
