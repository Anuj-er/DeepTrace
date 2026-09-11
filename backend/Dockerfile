FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install system dependencies required by OpenCV and MTCNN
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory
COPY . .

# Create uploads and outputs directories with write permissions
RUN mkdir -p uploads outputs && chmod 777 uploads outputs

# HuggingFace Spaces require the app to listen on port 7860
ENV PORT=7860
EXPOSE 7860

# Run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
