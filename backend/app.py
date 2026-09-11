import gradio as gr
from main import app as fastapi_app

# Create a tiny dummy Gradio interface so HuggingFace's health checks pass
demo = gr.Interface(
    fn=lambda: "DeepTrace Backend API is running!", 
    inputs=None, 
    outputs="text",
    title="DeepTrace API Status"
)

# Mount our full FastAPI backend to the Gradio app
# Our API will be available at the root URL (/api/...)
app = gr.mount_gradio_app(fastapi_app, demo, path="/gradio_status")
