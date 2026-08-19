"""
Skill Analyzer - Analyzes GitHub repositories to build developer skill profiles.
"""

from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
import json
import os
from typing import Any


class SkillAnalyzer:
    def __init__(self):
        self.openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.anthropic_client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    async def analyze(self, repos: list[dict[str, Any]], user_id: str) -> dict:
        """Analyze repositories and return a skill profile."""
        
        # Prepare repo data for analysis
        repo_summaries = []
        for repo in repos[:20]:  # Limit to top 20 repos
            repo_summaries.append({
                "name": repo.get("name"),
                "language": repo.get("language"),
                "languages": repo.get("languages", {}),
                "topics": repo.get("topics", []),
                "description": repo.get("description"),
                "stars": repo.get("starsCount", 0),
                "forks": repo.get("forksCount", 0),
            })

        prompt = f"""Analyze these GitHub repositories to build a comprehensive developer skill profile.

Repositories:
{json.dumps(repo_summaries, indent=2)}

Return a JSON object with:
{{
  "languages": [{{"name": "TypeScript", "proficiency": 0.85, "years": "3+"}}],
  "frameworks": ["React", "Next.js", "Node.js", "PostgreSQL"],
  "strengths": ["Frontend development", "API design", "Database modeling"],
  "weaknesses": ["Testing", "DevOps/CI-CD", "Security"],
  "experience_level": "intermediate",
  "primary_focus": "fullstack",
  "suggested_contribution_areas": ["React ecosystem", "TypeScript projects", "Node.js tools"],
  "repository_insights": [
    {{"repo": "repo-name", "insight": "Shows strong TypeScript skills"}}
  ]
}}

Be specific and accurate. Analyze the actual code patterns, not just the tech stack.
Return ONLY valid JSON."""

        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                response_format={"type": "json_object"},
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            # Fallback: basic analysis from repo metadata
            return self._basic_analysis(repos)

    def _basic_analysis(self, repos: list[dict]) -> dict:
        """Fallback: basic skill analysis from repo metadata."""
        languages = {}
        topics = set()
        
        for repo in repos:
            lang = repo.get("language")
            if lang:
                languages[lang] = languages.get(lang, 0) + 1
            
            for topic in repo.get("topics", []):
                topics.add(topic)

        # Sort languages by frequency
        sorted_langs = sorted(languages.items(), key=lambda x: x[1], reverse=True)
        
        return {
            "languages": [
                {"name": lang, "proficiency": min(0.9, 0.5 + (count * 0.05)), "years": "varies"}
                for lang, count in sorted_langs[:10]
            ],
            "frameworks": [],
            "strengths": [f"{lang} development" for lang, _ in sorted_langs[:3]],
            "weaknesses": ["To be determined with more analysis"],
            "experience_level": "intermediate",
            "primary_focus": "fullstack",
            "suggested_contribution_areas": [],
            "repository_insights": [],
        }
