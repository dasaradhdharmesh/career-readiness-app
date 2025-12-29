from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app import auth, resume_parser, llm_client, models
from app.analyzer import router as analyzer_router
from app.aptitude import router as aptitude_router
from db.database import init_db

# 1️⃣ CREATE APP FIRST
app = FastAPI(title="Career Readiness API (local prototype)")

# 2️⃣ CORS (if you already had it, keep it here)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3️⃣ INIT DB (if used)
init_db()

# 4️⃣ REGISTER ROUTERS
app.include_router(analyzer_router)
app.include_router(aptitude_router)


# -----------------------------
# Startup
# -----------------------------
init_db()

# -----------------------------
# Middleware
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Auth
# -----------------------------
@app.post("/auth/signup")
def signup(
    email: str = Form(...),
    password: str = Form(...),
    name: str = Form(None)
):
    try:
        auth.create_user(email, password, name)
        token = auth.create_access_token({"sub": email})
        return {"access_token": token, "token_type": "bearer"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/auth/login")
def login(
    email: str = Form(...),
    password: str = Form(...)
):
    user = auth.authenticate_user(email, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth.create_access_token({"sub": email})
    return {"access_token": token, "token_type": "bearer"}

# -----------------------------
# Resume
# -----------------------------
@app.post("/resume/upload", response_model=models.ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()
    saved = resume_parser.save_uploaded_file(contents, file.filename)
    return {"resume_id": saved, "filename": file.filename}


@app.post("/resume/parse")
def parse_resume(resume_id: str = Form(...)):
    return resume_parser.parse_resume(resume_id)

# -----------------------------
# Self Intro
# -----------------------------
@app.post("/selfintro/generate")
def selfintro(
    name: str = Form(...),
    role: str = Form(...),
    length: str = Form("15s"),
    tone: str = Form("Formal")
):
    return llm_client.generate_self_intro(name, role, length, tone)

# -----------------------------
# Aptitude
# -----------------------------
@app.post("/aptitude/questions")
def aptitude_questions(
    topic: str = Form(...),
    count: int = Form(5)
):
    return llm_client.generate_aptitude_questions(topic, count)


@app.post("/aptitude/evaluate")
def aptitude_evaluate(
    question: str = Form(...),
    answer: str = Form(...)
):
    return llm_client.evaluate_answer(answer, question)

# -----------------------------
# Vocabulary (Demo Mode)
# -----------------------------
@app.post("/vocab/evaluate")
def vocab_evaluate():
    return llm_client.evaluate_vocabulary_stub()
