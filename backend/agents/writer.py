"""
Writer agent — calls AWS Bedrock (Claude) to synthesize research into a
structured blog post matching the ResearchInk JSON schema.
"""

import json
import math
import os
from typing import Any

import boto3
from botocore.config import Config

_BEDROCK_CONFIG = Config(
    connect_timeout=10,
    read_timeout=300,  # Claude can take 2-4 min for a full blog post
    retries={"max_attempts": 2, "mode": "standard"},
)


def _build_prompt(topic: str, research: dict[str, Any]) -> str:
    web_snippets = "\n".join(
        f"- [{r['title']}]({r['url']}): {r['content'][:300]}"
        for r in research.get("web", [])
    )
    arxiv_snippets = "\n".join(
        f"- {r['title']} ({r['url']}): {r['summary'][:300]}"
        for r in research.get("arxiv", [])
    )

    return f"""You are an expert science writer. Using the research below, write a comprehensive, engaging blog post about: "{topic}"

## Web Research
{web_snippets}

## Academic Papers
{arxiv_snippets}

Return ONLY valid JSON matching this exact schema (no markdown fences, no extra keys):

{{
  "title": "<string, max 80 chars>",
  "subtitle": "<string, 1 sentence hook>",
  "hero_image": true,
  "reading_time": "<string, e.g. '6 min read'>",
  "tags": ["<string>"],
  "intro": {{
    "hook": "<string, 1-2 punchy opening lines>",
    "context": "<string, why this topic matters now>",
    "what_you_will_learn": "<string, 1-sentence promise>"
  }},
  "sections": [
    {{
      "heading": "<string>",
      "content": "<string, 3-5 paragraphs>",
      "generate_image": <true|false>,
      "key_insight": "<string, bold callout line>",
      "sources": ["<full URL — use the web URL or the arxiv entry_id URL, never a plain title>"]
    }}
  ],
  "key_takeaways": ["<string>"],
  "conclusion": {{
    "summary": "<string>",
    "forward_look": "<string, open question or what comes next>"
  }},
  "references": [
    {{
      "title": "<string>",
      "url": "<string>",
      "type": "<web|arxiv>"
    }}
  ]
}}

Rules:
- Include 4-6 sections with substantive content.
- Set generate_image=true for the 2 most visually compelling sections only.
- reading_time = ceil(total_word_count / 200) formatted as "N min read".
- All sources must be full URLs taken directly from the research provided above (web urls or arxiv entry_id urls). Never use plain titles as sources.
- NEVER use em dashes (—) anywhere. Use a comma, colon, or rewrite the sentence.
- Do NOT wrap key_insight values in quotation marks. Write them as plain declarative statements.
- Use plain ASCII punctuation only: hyphens (-), not en/em dashes.
- Return pure JSON only."""


def _calculate_reading_time(blog: dict[str, Any]) -> str:
    text = " ".join(
        [
            blog.get("intro", {}).get("hook", ""),
            blog.get("intro", {}).get("context", ""),
            blog.get("intro", {}).get("what_you_will_learn", ""),
            blog.get("conclusion", {}).get("summary", ""),
            blog.get("conclusion", {}).get("forward_look", ""),
        ]
        + [s.get("content", "") for s in blog.get("sections", [])]
    )
    word_count = len(text.split())
    minutes = math.ceil(word_count / 200)
    return f"{minutes} min read"


async def generate_blog(topic: str, research: dict[str, Any]) -> dict[str, Any]:
    bedrock = boto3.client(
        "bedrock-runtime",
        region_name=os.environ["AWS_REGION"],
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
        config=_BEDROCK_CONFIG,
    )

    prompt = _build_prompt(topic, research)
    model_id = os.environ["BEDROCK_CLAUDE_MODEL_ID"]

    body = json.dumps(
        {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 8192,
            "messages": [{"role": "user", "content": prompt}],
        }
    )

    response = bedrock.invoke_model(modelId=model_id, body=body)
    raw = json.loads(response["body"].read())
    text = raw["content"][0]["text"].strip()

    # Strip accidental markdown fences
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    blog = json.loads(text)

    # Always enforce hero_image = true and recalculate reading_time
    blog["hero_image"] = True
    blog["reading_time"] = _calculate_reading_time(blog)

    # Cap generate_image=true to at most 2 sections
    image_count = 0
    for section in blog.get("sections", []):
        if section.get("generate_image"):
            if image_count < 2:
                image_count += 1
            else:
                section["generate_image"] = False

    return blog
