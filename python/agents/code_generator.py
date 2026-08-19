"""
Code Generator Agent - Generates code for open source contributions.
"""

from openai import AsyncOpenAI
import json
import os
from typing import Any, Optional


class CodeGenerator:
    def __init__(self):
        self.openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def generate(
        self,
        issue_title: str,
        issue_body: str,
        relevant_files: list[dict[str, str]],
        repo_context: dict[str, Any],
        user_preferences: Optional[dict] = None,
    ) -> dict:
        """Generate code for a contribution."""
        
        files_context = "\n".join([
            f"--- {f['path']} ---\n{f['content'][:3000]}"
            for f in relevant_files
        ]) if relevant_files else "No existing files provided."

        prompt = f"""You are an expert open source contributor. Generate code to solve this issue.

Issue Title: {issue_title}
Issue Description: {issue_body[:3000] if issue_body else 'No description'}

Repository Context:
- Languages: {', '.join(repo_context.get('languages', {}).keys())}
- Topics: {', '.join(repo_context.get('topics', []))}

Existing Code:
{files_context}

Generate a complete solution following these rules:
1. Follow the existing code style and conventions
2. Add appropriate comments for complex logic
3. Handle edge cases and errors
4. Keep changes minimal and focused on the issue
5. Include proper TypeScript types where applicable

Return a JSON object:
{{
  "files": [
    {{
      "path": "path/to/file.ts",
      "content": "complete file content here",
      "action": "create",
      "explanation": "Why this file was created/modified"
    }}
  ],
  "commit_message": "type(scope): description",
  "pr_title": "feat: descriptive PR title",
  "pr_body": "## Changes\\n\\n...\\n\\n## Testing\\n\\n...",
  "tests_needed": true,
  "additional_notes": "Any additional notes about the implementation"
}}

Return ONLY valid JSON."""

        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4,
                max_tokens=8000,
                response_format={"type": "json_object"},
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            return {
                "error": str(e),
                "files": [],
                "commit_message": "chore: initial implementation",
                "pr_title": "feat: implementation",
                "pr_body": "## Changes\n\nSee file changes.\n\n## Testing\n\nPlease review.",
                "tests_needed": True,
                "additional_notes": "Code generation encountered an error. Please try again.",
            }
