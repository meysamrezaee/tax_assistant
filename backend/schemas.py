# schemas.py
from pydantic import BaseModel, Field
from typing import List

class Source(BaseModel):
    file: str
    page: int

class LLMResponse(BaseModel):
    response: str
    sources: List[Source]

class PromptRequest(BaseModel):
    prompt: str = Field(
        min_length=1,
        description="User prompt"
    )

class ModelSelectRequest(BaseModel):
    model: str