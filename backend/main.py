# main.py
from fastapi import FastAPI, HTTPException
from schemas import PromptRequest, LLMResponse, ModelSelectRequest
from model.llm import generate_response, chat_history, set_model, get_model
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

app = FastAPI()

# Read frontend URL from the .env file. If the file doesn't exist, then just use http://localhost:3000
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Allow your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Tax Assistant API Running"}


@app.post("/chat", response_model=LLMResponse)
async def chat(prompt_request: PromptRequest):

    try:
        output = generate_response(prompt_request.prompt)

        return output

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except RuntimeError as e:
        raise HTTPException(
            status_code=503,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected server error: {str(e)}"
        )

@app.post("/clearchat")
async def clear_chat ():
    chat_history.clear()
    return {"message": "Chat history cleared."}

@app.post("/selectmodel")
async def select_model(request: ModelSelectRequest):
    model_name = request.model
    print(model_name)
    set_model(model_name)
    return {"message": f"Model set to {get_model()}"}