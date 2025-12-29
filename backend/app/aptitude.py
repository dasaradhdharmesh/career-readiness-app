from fastapi import APIRouter, Form
from app.llm_client import generate_aptitude_questions

router = APIRouter(prefix="/aptitude", tags=["Aptitude"])
@router.post("/questions")
def aptitude_questions(
    topic: str = Form("ALL"),
    count: int = Form(25)
):
    return generate_aptitude_questions(topic, count)
