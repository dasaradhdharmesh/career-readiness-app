"""
Resume–JD Scoring Engine

Responsibilities:
- Compute skill match score (priority weighted)
- Approximate experience alignment
- Penalize missing critical skills
- Add basic resume format quality signal

This module is intentionally deterministic and explainable.
"""

def compute_skill_score(jd_skills, matched, missing):
    """
    Compute weighted skill score.
    Must-have = 2x
    Preferred = 1.5x
    Nice-to-have = 1x
    """
    weight_map = {
        "must": 2.0,
        "preferred": 1.5,
        "nice-to-have": 1.0
    }

    total_weight = 0.0
    matched_weight = 0.0

    for entry in jd_skills:
        skill = entry.get("skill")
        priority = entry.get("priority", "preferred")
        weight = weight_map.get(priority, 1.0)

        total_weight += weight

        if skill in matched:
            matched_weight += weight

    if total_weight == 0:
        return 0.0

    return (matched_weight / total_weight) * 100.0


def compute_experience_score(jd_skills):
    """
    Approximate experience alignment based on JD skill levels.
    This is a proxy, not a claim of exact experience.
    """
    level_map = {
        "beginner": 1,
        "intermediate": 2,
        "senior": 3,
        "expert": 4
    }

    if not jd_skills:
        return 100.0

    total_level = 0
    for entry in jd_skills:
        level = entry.get("level", "intermediate")
        total_level += level_map.get(level, 2)

    avg_level = total_level / len(jd_skills)

    if avg_level <= 1.5:
        return 100.0
    elif avg_level <= 2.5:
        return 90.0
    elif avg_level <= 3.5:
        return 75.0
    else:
        return 60.0


def compute_missing_penalty(jd_skills, missing):
    """
    Penalize missing skills.
    Missing must-have skills hurt the score significantly.
    """
    penalty = 0

    for entry in jd_skills:
        skill = entry.get("skill")
        priority = entry.get("priority", "preferred")

        if skill in missing:
            if priority == "must":
                penalty += 15
            elif priority == "preferred":
                penalty += 7
            else:
                penalty += 3

    return min(penalty, 40)  # hard cap


def compute_format_score(resume_text):
    """
    Very lightweight proxy for resume structure/quality.
    """
    if not resume_text:
        return 50.0

    length = len(resume_text)

    if length > 500:
        return 100.0
    elif length > 200:
        return 80.0
    else:
        return 50.0

def compute_keyword_score(jd_text: str, resume_text: str) -> float:
    if not jd_text or not resume_text:
        return 0.0

    jd_tokens = set(jd_text.lower().split())
    resume_tokens = set(resume_text.lower().split())

    if not jd_tokens:
        return 0.0

    overlap = jd_tokens & resume_tokens
    return round((len(overlap) / len(jd_tokens)) * 100.0, 2)


def compute_score(jd_skills, matched, missing, resume_text="", jd_text=""):
    """
    Main scoring function.

    Returns:
    - breakdown (dict)
    - total_score (0–100)
    """
    skill_score = compute_skill_score(jd_skills, matched, missing)
    experience_score = compute_experience_score(jd_skills)
    format_score = compute_format_score(resume_text)
    penalty = compute_missing_penalty(jd_skills, missing)
    keyword_score = compute_keyword_score(jd_text, resume_text)


    total = (
    (skill_score * 0.50) +
    (keyword_score * 0.20) +
    (experience_score * 0.20) +
    (format_score * 0.05)
)


    total -= penalty
    total = max(0.0, min(100.0, total))

    breakdown = {
        "keywords_match": round(keyword_score, 2),
        "skills_match": round(skill_score, 2),
        "experience_relevance": round(experience_score, 2),
        "format_quality": round(format_score, 2),
        "missing_penalty": penalty
    }



    return breakdown, round(total, 2)
