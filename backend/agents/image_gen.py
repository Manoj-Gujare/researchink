"""
Image generation agent — calls AWS Bedrock Titan Image Generator v2.
Strictly capped at 3 images per blog: 1 hero + up to 2 section images.
All images returned as base64-encoded PNG strings.
"""

import base64
import json
import os
from typing import Any

import boto3

MAX_IMAGES = 3
MAX_SECTION_IMAGES = 2


def _make_prompt(text: str) -> str:
    """Trim and clean a prompt to stay within Titan's 512-token limit."""
    return text[:400].strip()


def _invoke_titan(bedrock: Any, prompt: str) -> str:
    """Call Titan Image Generator and return a base64 PNG string."""
    model_id = os.environ["BEDROCK_IMAGE_MODEL_ID"]
    body = json.dumps(
        {
            "taskType": "TEXT_IMAGE",
            "textToImageParams": {"text": prompt},
            "imageGenerationConfig": {
                "numberOfImages": 1,
                "height": 768,
                "width": 1280,
                "cfgScale": 8.0,
                "seed": 42,
            },
        }
    )
    response = bedrock.invoke_model(modelId=model_id, body=body)
    result = json.loads(response["body"].read())
    return result["images"][0]  # already base64


async def generate_images(blog: dict[str, Any]) -> dict[str, Any]:
    bedrock = boto3.client(
        "bedrock-runtime",
        region_name=os.environ["AWS_REGION"],
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )

    image_budget = MAX_IMAGES  # starts at 3

    # 1. Hero image — always generated (consumes 1 slot)
    if blog.get("hero_image"):
        hero_prompt = _make_prompt(
            f"Professional editorial hero image for a blog post titled: {blog['title']}. "
            f"{blog.get('subtitle', '')}. Photorealistic, high quality."
        )
        blog["hero_image_b64"] = _invoke_titan(bedrock, hero_prompt)
        image_budget -= 1

    # 2. Section images — up to MAX_SECTION_IMAGES (2)
    section_images_generated = 0
    for section in blog.get("sections", []):
        if image_budget <= 0 or section_images_generated >= MAX_SECTION_IMAGES:
            section["generate_image"] = False
            section["image_b64"] = None
            continue

        if section.get("generate_image"):
            section_prompt = _make_prompt(
                f"Illustrative image for blog section titled: {section['heading']}. "
                f"{section.get('key_insight', '')}. Photorealistic, editorial quality."
            )
            section["image_b64"] = _invoke_titan(bedrock, section_prompt)
            section_images_generated += 1
            image_budget -= 1
        else:
            section["image_b64"] = None

    return blog
