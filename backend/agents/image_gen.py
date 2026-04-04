"""
Image generation agent — calls AWS Bedrock Titan Image Generator.
Strictly capped at 3 images per blog: 1 hero + up to 2 section images.
"""

MAX_IMAGES = 3


async def generate_images(blog: dict) -> dict:
    # TODO: implement in feature/image-gen branch
    raise NotImplementedError
