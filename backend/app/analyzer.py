from fastapi import APIRouter, UploadFile, File, Form
from .resume_parser import parse_resume, save_uploaded_file
from .jd_parser import extract_jd_skills
from .scorer import compute_score

router = APIRouter(prefix="/analyze", tags=["Resume Analysis"])


@router.post("/resume/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    # 1️⃣ Save uploaded resume
    contents = await file.read()
    saved_filename = save_uploaded_file(contents, file.filename)

    # 2️⃣ Parse saved resume (CORRECT usage)
    parsed = parse_resume(saved_filename)

    resume_text = parsed.get("text", "")
    resume_skills = set(parsed.get("skills", []))

    # 3️⃣ Parse JD
    jd_skills = extract_jd_skills(job_description)
    jd_skill_names = {s["skill"] for s in jd_skills}

    matched = sorted(resume_skills & jd_skill_names)
    missing = sorted(jd_skill_names - resume_skills)

    # 4️⃣ Score
    breakdown, total_score = compute_score(
        jd_skills=jd_skills,
        matched=matched,
        missing=missing,
        resume_text=resume_text,
        jd_text=job_description
        )


    return {
        "total_score": total_score,
        "breakdown": breakdown,
        "matched_skills": matched,
        "missing_skills": missing
    }
