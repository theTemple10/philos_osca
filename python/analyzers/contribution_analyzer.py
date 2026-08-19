"""
Contribution Analyzer - Analyzes how well an issue matches a developer's skills.
"""

from openai import AsyncOpenAI
import json
import os
from typing import Any


class ContributionAnalyzer:
    def __init__(self):
        self.openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def analyze(
        self,
        issue_title: str,
        issue_body: str,
        issue_labels: list[str],
        repo_languages: dict[str, float],
        repo_topics: list[str],
        user_skills: dict[str, Any],
    ) -> dict:
        """Analyze a contribution opportunity."""
        
        prompt = f"""Analyze this open source contribution opportunity for the developer.

Developer Skills:
{json.dumps(user_skills, indent=2)}

Repository:
- Languages: {json.dumps(repo_languages)}
- Topics: {', '.join(repo_topics)}

Issue:
- Title: {issue_title}
- Labels: {', '.join(issue_labels)}
- Description: {issue_body[:2000] if issue_body else 'No description'}

Return a JSON object:
{{
  "skill_match": 0.85,
  "difficulty": "medium",
  "estimated_time": "2-4 hours",
  "suggested_approach": "Step-by-step approach to solve this issue",
  "relevant_files": ["src/components/Button.tsx"],
  "learning_opportunity": "What the developer can learn from this contribution",
  "confidence": 0.9,
  "pros": ["Good match for frontend skills"],
  "cons": ["Requires understanding of testing patterns"],
  "recommendation": "recommended"  // recommended, possible, challenging, skip
}}

Return ONLY valid JSON."""

        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                response_format={"type": "json_object"},
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            # Fallback: basic analysis
            return self._basic_analysis(
                issue_title, issue_labels, repo_languages, user_skills
            )

    def _basic_analysis(
        self,
        issue_title: str,
        issue_labels: list[str],
        repo_languages: dict[str, float],
        user_skills: dict,
    ) -> dict:
        """Fallback: basic contribution analysis."""
        # Check for beginner-friendly labels
        is_beginner_friendly = any(
            label.lower() in ["good first issue", "beginner", "easy", "help wanted"]
            for label in issue_labels
        )
        
        # Basic difficulty assessment
        difficulty = "easy" if is_beginner_friendly else "medium"
        
        return {
            "skill_match": 0.7 if is_beginner_friendly else 0.5,
            "difficulty": difficulty,
            "estimated_time": "1-3 hours" if is_beginner_friendly else "3-6 hours",
            "suggested_approach": "Review the issue carefully and understand the requirements before coding.",
            "relevant_files": [],
            "learning_opportunity": "Contributing to open source and working with the project's codebase.",
            "confidence": 0.6,
            "pros": ["Open for contribution"] if is_beginner_friendly else [],
            "cons": ["May require deeper analysis"],
            "recommendation": "possible",
        }
