from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.dspy_service import DSPyService

router = APIRouter()
dspy_service = DSPyService()

class QuestionRequest(BaseModel):
    text: str

class AnswerResponse(BaseModel):
    question: str
    answer: str
    context: dict

@router.post("/ask", response_model=AnswerResponse)
async def ask_physics_question(request: QuestionRequest):
    """
    Endpoint to ask a physics question.
    It uses DSPy to synthesize an answer from Knowledge Graph and Spanner Graph data.
    """
    if not request.text:
        raise HTTPException(status_code=400, detail="Question text is required")

    result = dspy_service.process_query(request.text)
    return result
