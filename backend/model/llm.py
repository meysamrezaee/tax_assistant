# model/llm.py
import requests
from requests.exceptions import ConnectionError, Timeout, RequestException
from rag.retriever import get_context
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/chat")

# Choose the model you want Ollama to use
OLLAMA_MODEL = "llama3:instruct"  # or "llama3:instruct" "mistral:instruct", "phi3:instruct", etc.

# In-memory chat history (shared globally)
chat_history = []


def set_model(model_name: str):
    global OLLAMA_MODEL
    OLLAMA_MODEL = model_name

def get_model():
    return OLLAMA_MODEL

def generate_response(user_input: str) -> str:

    if not user_input.strip():
        raise ValueError("Prompt cannot be empty")

    global chat_history

    # Save original user message
    chat_history.append({
        "role": "user",
        "content": user_input
    })

    # Retrieve relevant document chunks
    #context = get_context(user_input)
    context, sources = get_context(user_input)

    rag_prompt = f"""
You are a tax assistant.

Answer using the provided context.

If the answer cannot be found in the context, clearly state that the information was not found in the provided tax documents.

Context:
{context}

Question:
{user_input}
"""

    # Create a copy of the conversation for Ollama
    # without contaminating chat history with huge contexts
    messages = chat_history.copy()

    # Replace only the latest user message
    messages[-1] = {
        "role": "user",
        "content": rag_prompt
    }

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "messages": messages,
                "stream": False
            },
            timeout=60
        )

        response.raise_for_status()

        data = response.json()

        bot_reply = data["message"]["content"].strip()

        chat_history.append({
            "role": "assistant",
            "content": bot_reply
        })

        return {  
        "response": bot_reply,
        "sources": sources
        }
        
    except ConnectionError:

        raise RuntimeError(
            "Unable to connect to Ollama. Is Ollama running?"
        )

    except Timeout:

        raise RuntimeError(
            "Ollama request timed out."
        )

    except RequestException as e:

        raise RuntimeError(
            f"Ollama API error: {str(e)}"
        )