import uuid
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from agents.researcher import run_research
from agents.writer import generate_blog
from agents.image_gen import generate_images
from models.schemas import BlogRequest, BlogResponse, BlogPost

load_dotenv()

app = FastAPI(
    title="ResearchInk API",
    version="1.0.0",
    # Full pipeline (research + Claude + 3 Titan images) can take 3-5 min
    # Set a generous timeout hint for tooling; actual enforcement is in uvicorn CLI
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store — replace with a DB for production
_blog_store: dict[str, Any] = {}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/generate", response_model=BlogResponse)
async def generate(request: BlogRequest):
    """
    Full pipeline:
    1. Parallel Tavily + Arxiv research
    2. Bedrock Claude blog generation
    3. Titan image generation (max 3 images)
    """
    try:
        # Step 1: research
        research = await run_research(request.topic)

        # Step 2: write blog
        blog_dict = await generate_blog(request.topic, research)

        # Step 3: generate images (mutates blog_dict in-place)
        blog_dict = await generate_images(blog_dict)

        # Persist and return
        blog_id = str(uuid.uuid4())
        blog = BlogPost(**blog_dict)
        _blog_store[blog_id] = blog

        return BlogResponse(id=blog_id, blog=blog)

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/blog/{blog_id}", response_model=BlogResponse)
async def get_blog(blog_id: str):
    blog = _blog_store.get(blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return BlogResponse(id=blog_id, blog=blog)
