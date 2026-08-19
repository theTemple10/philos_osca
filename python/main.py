"""
OSS Contributor Python Service
Handles heavy AI/ML tasks for repository analysis and code generation.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="OSS Contributor Analysis Service",
    description="Python service for AI-powered open source contribution analysis",
    version="0.1.0",
)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Models ───────────────────────────────────────────────────

class RepoAnalysisRequest(BaseModel):
    repos: list[dict]  # GitHub repo data
    user_id: str


class SkillProfile(BaseModel):
    languages: list[dict]
    frameworks: list[str]
    strengths: list[str]
    weaknesses: list[str]
    experience_level: str
    primary_focus: str
    suggested_contribution_areas: list[str]


class ContributionMatch(BaseModel):
    issue_title: str
    issue_body: str
    issue_labels: list[str]
    repo_languages: dict
    repo_topics: list[str]
    user_skills: dict


class CodeGenerationRequest(BaseModel):
    issue_title: str
    issue_body: str
    relevant_files: list[dict]
    repo_context: dict
    user_preferences: Optional[dict] = None


# ─── Endpoints ────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "oss-contributor-python"}


@app.post("/analyze/skills", response_model=SkillProfile)
async def analyze_user_skills(request: RepoAnalysisRequest):
    """
    Analyze a user's repositories to build a comprehensive skill profile.
    Uses OpenAI/Claude for deep analysis.
    """
    from analyzers.skill_analyzer import SkillAnalyzer

    analyzer = SkillAnalyzer()
    profile = await analyzer.analyze(repos=request.repos, user_id=request.user_id)
    return profile


@app.post("/analyze/contribution")
async def analyze_contribution(request: ContributionMatch):
    """
    Analyze how well a contribution opportunity matches a user's skills.
    Returns difficulty, time estimate, and approach suggestion.
    """
    from analyzers.contribution_analyzer import ContributionAnalyzer

    analyzer = ContributionAnalyzer()
    analysis = await analyzer.analyze(
        issue_title=request.issue_title,
        issue_body=request.issue_body,
        issue_labels=request.issue_labels,
        repo_languages=request.repo_languages,
        repo_topics=request.repo_topics,
        user_skills=request.user_skills,
    )
    return analysis


@app.post("/generate/code")
async def generate_code(request: CodeGenerationRequest):
    """
    Generate code for a contribution based on the issue and relevant files.
    Returns file changes, commit message, and PR details.
    """
    from agents.code_generator import CodeGenerator

    generator = CodeGenerator()
    result = await generator.generate(
        issue_title=request.issue_title,
        issue_body=request.issue_body,
        relevant_files=request.relevant_files,
        repo_context=request.repo_context,
        user_preferences=request.user_preferences,
    )
    return result


@app.post("/discover/repositories")
async def discover_repositories(user_skills: dict):
    """
    Find repositories that match a user's skill profile and interests.
    """
    from agents.repo_discoverer import RepoDiscoverer

    discoverer = RepoDiscoverer()
    suggestions = await discoverer.discover(user_skills=user_skills)
    return suggestions


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
