"""
Researcher agent — Tavily web search + Arxiv academic paper retrieval.
Both sources run in parallel via asyncio.gather.
"""

import asyncio
import os
from typing import Any

import arxiv
from tavily import TavilyClient


def _search_tavily(topic: str) -> list[dict[str, Any]]:
    client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
    response = client.search(
        query=topic,
        search_depth="advanced",
        max_results=8,
        include_answer=True,
    )
    results = []
    for r in response.get("results", []):
        results.append(
            {
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "content": r.get("content", ""),
                "score": r.get("score", 0),
            }
        )
    return results


def _search_arxiv(topic: str) -> list[dict[str, Any]]:
    client = arxiv.Client()
    search = arxiv.Search(
        query=topic,
        max_results=5,
        sort_by=arxiv.SortCriterion.Relevance,
    )
    results = []
    for paper in client.results(search):
        results.append(
            {
                "title": paper.title,
                "url": paper.entry_id,
                "summary": paper.summary[:600],
                "authors": [a.name for a in paper.authors[:3]],
                "published": paper.published.isoformat() if paper.published else "",
            }
        )
    return results


async def run_research(topic: str) -> dict[str, Any]:
    loop = asyncio.get_event_loop()

    tavily_task = loop.run_in_executor(None, _search_tavily, topic)
    arxiv_task = loop.run_in_executor(None, _search_arxiv, topic)

    web_results, arxiv_results = await asyncio.gather(tavily_task, arxiv_task)

    return {
        "topic": topic,
        "web": web_results,
        "arxiv": arxiv_results,
    }
