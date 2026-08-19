"""
Repository Discoverer Agent - Finds repositories matching a developer's skills.
"""

from openai import AsyncOpenAI
import json
import os
from typing import Any


class RepoDiscoverer:
    def __init__(self):
        self.openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def discover(self, user_skills: dict[str, Any]) -> dict:
        """Discover repositories matching user skills."""
        
        prompt = f"""Based on this developer's skill profile, suggest open source repositories and search strategies.

Developer Skills:
{json.dumps(user_skills, indent=2)}

Return a JSON object with:
{{
  "search_queries": [
    {{
      "query": "react component library typescript",
      "language": "TypeScript",
      "reason": "Matches frontend TypeScript expertise",
      "difficulty": "medium"
    }}
  ],
  "recommended_labels": ["good first issue", "help wanted", "beginner friendly"],
  "recommended_topics": ["react", "typescript", "nextjs"],
  "contribution_strategies": [
    {{
      "strategy": "Bug fixes in TypeScript projects",
      "description": "Start with bug fixes to understand codebase",
      "difficulty": "easy"
    }}
  ],
  "learning_paths": [
    {{
      "area": "Testing",
      "suggested_repos": ["testing-library/react-testing-library"],
      "reason": "Improve testing skills while contributing"
    }}
  ]
}}

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
            # Fallback: basic suggestions based on skills
            return self._basic_suggestions(user_skills)

    def _basic_suggestions(self, user_skills: dict) -> dict:
        """Fallback: basic repository suggestions."""
        languages = user_skills.get("languages", [])
        top_langs = [l.get("name", "") for l in languages[:3]]
        
        return {
            "search_queries": [
                {
                    "query": f"{lang.lower()} project",
                    "language": lang,
                    "reason": f"Leverage {lang} experience",
                    "difficulty": "medium"
                }
                for lang in top_langs
            ],
            "recommended_labels": ["good first issue", "help wanted"],
            "recommended_topics": [],
            "contribution_strategies": [
                {
                    "strategy": "Start with documentation",
                    "description": "Improve docs while learning the codebase",
                    "difficulty": "easy"
                }
            ],
            "learning_paths": [],
        }
