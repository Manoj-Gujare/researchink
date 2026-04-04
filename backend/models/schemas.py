from pydantic import BaseModel, Field
from typing import List, Literal


class BlogRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=200)


class Reference(BaseModel):
    title: str
    url: str
    type: Literal["web", "arxiv"]


class Section(BaseModel):
    heading: str
    content: str
    generate_image: bool
    key_insight: str
    sources: List[str]
    image_b64: str | None = None


class Intro(BaseModel):
    hook: str
    context: str
    what_you_will_learn: str


class Conclusion(BaseModel):
    summary: str
    forward_look: str


class BlogPost(BaseModel):
    title: str = Field(..., max_length=80)
    subtitle: str
    hero_image: bool = True
    hero_image_b64: str | None = None
    reading_time: str
    tags: List[str]
    intro: Intro
    sections: List[Section]
    key_takeaways: List[str]
    conclusion: Conclusion
    references: List[Reference]


class BlogResponse(BaseModel):
    id: str
    blog: BlogPost
