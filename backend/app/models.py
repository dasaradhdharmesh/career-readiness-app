from pydantic import BaseModel
from typing import List, Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class ResumeUploadResponse(BaseModel):
    resume_id: str
    filename: str

class AnalyzeRequest(BaseModel):
    resume_id: str
    job_text: str
