#!/usr/bin/env python3
"""
Generate MiniLM-L6-v2 embeddings for lessons and learning profiles, upload to Supabase.

Usage:
  pip install -r scripts/requirements-embeddings.txt
  # Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env (never commit service role)
  python scripts/embed_lessons.py

Requires migrations 001_ai_ml_foundation.sql applied first.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("EXPO_PUBLIC_SUPABASE_URL")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_KEY:
    print(
        "Missing SUPABASE_URL (or EXPO_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY in .env",
        file=sys.stderr,
    )
    sys.exit(1)

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
PROFILES_PATH = Path(__file__).parent / "learning_profiles.json"


def lesson_content(row: dict) -> str:
    parts = [
        row.get("title", ""),
        row.get("goal", ""),
        row.get("lesson_text", ""),
        " ".join(row.get("tags") or []),
        row.get("practice_task", ""),
    ]
    return "\n".join(p for p in parts if p)


def main() -> None:
    from sentence_transformers import SentenceTransformer
    from supabase import create_client

    print(f"Loading model {MODEL_NAME}...")
    model = SentenceTransformer(MODEL_NAME)
    client = create_client(SUPABASE_URL, SERVICE_KEY)

    print("Fetching lessons...")
    result = client.table("lessons").select("*").execute()
    lessons = result.data or []
    print(f"Found {len(lessons)} lessons")

    for row in lessons:
        content = lesson_content(row)
        vector = model.encode(content, normalize_embeddings=True).tolist()
        payload = {
            "lesson_id": row["id"],
            "content": content[:8000],
            "embedding": vector,
            "updated_at": "now()",
        }
        client.table("lesson_embeddings").upsert(
            payload, on_conflict="lesson_id"
        ).execute()
        print(f"  embedded lesson: {row['title']}")

    profiles = json.loads(PROFILES_PATH.read_text(encoding="utf-8"))
    print(f"Embedding {len(profiles)} learning profiles...")
    for profile in profiles:
        vector = model.encode(profile["query_text"], normalize_embeddings=True).tolist()
        client.table("learning_profiles").upsert(
            {
                "profile_key": profile["profile_key"],
                "goal": profile["goal"],
                "level": profile["level"],
                "skill": profile["skill"],
                "query_text": profile["query_text"],
                "embedding": vector,
            },
            on_conflict="profile_key",
        ).execute()
        print(f"  profile: {profile['profile_key']}")

    print("Done. Verify with:")
    print("  select count(*) from lesson_embeddings;")
    print("  select count(*) from learning_profiles;")


if __name__ == "__main__":
    main()
