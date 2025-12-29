from typing import List, Dict
from rapidfuzz import fuzz

# Keep this aligned with resume_parser for now
CANONICAL_SKILLS = [
    "Python", "JavaScript", "React", "Node.js", "TypeScript", "SQL",
    "Machine Learning", "Data Analysis", "Communication",
    "Git", "Docker", "AWS"
]

def extract_jd_skills(
    jd_text: str,
    threshold: int = 75
) -> List[Dict]:
    """
    Extract skills from a Job Description.

    Returns:
    [
      {
        "skill": "Python",
        "priority": "preferred",
        "level": "intermediate"
      }
    ]
    """
    jd_lower = jd_text.lower()
    skills = []

    for skill in CANONICAL_SKILLS:
        score = fuzz.partial_ratio(skill.lower(), jd_lower)
        if score >= threshold:
            skills.append({
                "skill": skill,
                "priority": "preferred",     # can be upgraded later
                "level": "intermediate"
            })

    return skills
