import os, uuid
from pathlib import Path
import pdfplumber
from docx import Document
from rapidfuzz import fuzz

# ---------------- CONFIG ----------------
DATA_DIR = Path(os.getenv("STORAGE_PATH", "./data"))
DATA_DIR.mkdir(parents=True, exist_ok=True)

CANONICAL_SKILLS = [
    "Python", "JavaScript", "React", "Node.js", "TypeScript", "SQL",
    "Machine Learning", "Data Analysis", "Communication",
    "Git", "Docker", "AWS"
]

# ---------------- STORAGE ----------------
def save_uploaded_file(file_bytes: bytes, filename: str) -> str:
    rid = str(uuid.uuid4())
    dest = DATA_DIR / f"{rid}__{filename}"
    with open(dest, "wb") as f:
        f.write(file_bytes)
    return dest.name

# ---------------- TEXT EXTRACTION ----------------
def extract_text_from_pdf(path: Path) -> str:
    text = []
    with pdfplumber.open(path) as pdf:
        for p in pdf.pages:
            page_text = p.extract_text()
            if page_text:
                text.append(page_text)
    return "\n".join(text)

def extract_text_from_docx(path: Path) -> str:
    doc = Document(path)
    return "\n".join(p.text for p in doc.paragraphs if p.text)

# ---------------- SKILL EXTRACTION ----------------
def extract_skills(text: str, threshold=75):
    matches = []
    for skill in CANONICAL_SKILLS:
        score = fuzz.partial_ratio(skill.lower(), text.lower())
        if score >= threshold:
            matches.append(skill)
    return sorted(set(matches))

# ---------------- BASIC PARSER (USED BY UI) ----------------
def parse_resume(filepath: str) -> dict:
    p = DATA_DIR / filepath

    if filepath.lower().endswith(".pdf"):
        txt = extract_text_from_pdf(p)
    elif filepath.lower().endswith(".docx"):
        txt = extract_text_from_docx(p)
    else:
        with open(p, "r", encoding="utf-8", errors="ignore") as f:
            txt = f.read()

    skills_found = extract_skills(txt)

    return {
        "text": txt,
        "skills": skills_found
    }

# ---------------- STRUCTURED PARSER (USED BY ANALYZER) ----------------
def parse_resume_structured(filepath: str) -> dict:
    """
    Canonical structured output for analyzer pipeline.
    """
    base = parse_resume(filepath)

    return {
        "raw_text": base["text"],
        "skills": {skill: {"confidence": 0.9, "category": ""} for skill in base["skills"]},
        "projects": [],
        "experience": [],
        "education": [],
        "summary": ""
    }
