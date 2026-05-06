"""
RodricksRestorations — FastAPI Backend
Run: uvicorn main:app --reload
"""

import json
import os
import uuid
import sqlite3
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

# ──────────────────────────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────────────────────────
DB_PATH      = "rodricks.db"
UPLOADS_DIR  = Path("uploads")
UPLOADS_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE_MB   = 20

# Default seed data (used only on first run when DB is empty)
DEFAULT_DATA = {
    "heroImages": [
        "https://images.unsplash.com/photo-1583121274603-d7eba2e77a10?w=1600&q=80",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1600&q=80",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80",
    ],
    "projects": [
        {"id":1,"name":"1967 Porsche 911","year":"2023","status":"finished","category":"Classic German","desc":"A stunning restoration of an iconic air-cooled flat-six legend.","outcome":"Returned to full concours condition with factory-correct Slate Grey paint and period-correct interior. Awarded Best in Class at the 2023 National Classic Car Show.","img":"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80","images":["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80","https://images.unsplash.com/photo-1583121274603-d7eba2e77a10?w=800&q=80"],"featured":True,"award":True,"timeline":[{"date":"2023-01-01","title":"Initial Assessment","desc":"Full strip-down and condition report completed."},{"date":"2023-02-01","title":"Bodywork & Chassis","desc":"Rust removal, panel beating, and chassis reinforcement."},{"date":"2023-04-01","title":"Engine Rebuild","desc":"Complete rebuild of the 2.0L flat-six engine."},{"date":"2023-06-01","title":"Paint & Trim","desc":"Factory-correct Slate Grey respray and leather interior."},{"date":"2023-08-01","title":"Final Assembly","desc":"Reassembly, testing and final detailing."}]},
        {"id":2,"name":"1955 Mercedes 300SL","year":"2023","status":"finished","category":"Classic German","desc":"The iconic gullwing doors brought back to their original glory.","outcome":"Immaculate restoration with matching-numbers engine rebuild and period Ivory paint. Now a museum piece.","img":"https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80","images":["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80"],"featured":True,"award":False,"timeline":[{"date":"2023-03-01","title":"Disassembly","desc":"Full teardown, all parts catalogued."},{"date":"2023-05-01","title":"Gullwing Door Restoration","desc":"Door alignment corrected, hinges rebuilt."},{"date":"2023-09-01","title":"Completion","desc":"Final inspection and client handover."}]},
        {"id":3,"name":"1969 Ford Mustang Boss 429","year":"2024","status":"current","category":"American Muscle","desc":"One of the rarest Mustangs ever built, currently under full restoration.","outcome":"","img":"https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&q=80","images":["https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&q=80"],"featured":False,"award":False,"timeline":[{"date":"2024-01-01","title":"Strip Down","desc":"Full disassembly and parts inventory in progress."}]},
        {"id":4,"name":"1963 Ferrari 250 GTE","year":"2022","status":"finished","category":"Italian Sports","desc":"A matching-numbers GTE returned to show condition.","outcome":"Ground-up restoration completed in 18 months. Now valued at over $2M.","img":"https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80","images":["https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80"],"featured":True,"award":True,"timeline":[{"date":"2021-01-01","title":"Acquisition","desc":"Vehicle acquired and initial assessment complete."},{"date":"2022-06-01","title":"Completion","desc":"Full concours restoration delivered to client."}]},
        {"id":5,"name":"1957 Chevrolet Bel Air","year":"2024","status":"current","category":"American Classic","desc":"The quintessential American classic receiving a frame-off restoration.","outcome":"","img":"https://images.unsplash.com/photo-1566024349612-2e56a9e73e96?w=800&q=80","images":["https://images.unsplash.com/photo-1566024349612-2e56a9e73e96?w=800&q=80"],"featured":False,"award":False,"timeline":[{"date":"2024-02-01","title":"Frame Off","desc":"Body removed from chassis. Chassis sandblasted."}]},
        {"id":6,"name":"1971 Jaguar E-Type Series 3","year":"2023","status":"finished","category":"British Classic","desc":"The last of the E-Types, beautifully restored in British Racing Green.","outcome":"Completed to original Jaguar specification with a rebuilt V12 engine.","img":"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80","images":["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80"],"featured":False,"award":False,"timeline":[{"date":"2022-04-01","title":"Start","desc":"Project commenced."},{"date":"2023-03-01","title":"Finish","desc":"Delivered to client in perfect condition."}]},
    ],
    "services": [
        {"id":1,"name":"Engine Restoration","desc":"Complete engine rebuilds and performance tuning. We restore engines to original specifications or enhance them with period-appropriate modifications. Our master mechanics specialize in vintage powerplants from pre-war to post-war era vehicles.","icon":"🔧","img":"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"},
        {"id":2,"name":"Body & Chassis Work","desc":"Frame-off restorations and structural rebuilds. Expert panel work, fabrication and rust remediation by our skilled coachbuilders restoring every panel to factory specification.","icon":"⚙️","img":"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80"},
        {"id":3,"name":"Paint & Finishing","desc":"Period-correct paint matching and application. Factory-correct resprays and custom finishes applied in our climate-controlled spray booth to achieve a flawless, show-quality result.","icon":"🎨","img":"https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80"},
        {"id":4,"name":"Interior Trimming","desc":"Bespoke interior restoration using the finest materials. Hand-stitched leather, Connolly hide and period-correct materials to revive every cabin to concours standard.","icon":"🛋️","img":"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80"},
        {"id":5,"name":"Servicing & Recommissioning","desc":"Full mechanical service and recommissioning of classic vehicles. We bring dormant vehicles back to life with full fluid changes, brake overhauls, and safety inspections.","icon":"🔩","img":"https://images.unsplash.com/photo-1635773054018-2b0c29be3b6d?w=600&q=80"},
        {"id":6,"name":"Precision Engineering","desc":"In-house precision engineering solutions for mechanical components large and small. Our fully equipped machine shop handles every stage of manufacture and rebuild.","icon":"🏗️","img":"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80"},
    ],
    "messages": [],
    "users": [{"id":1,"username":"admin","password":"YWRtaW5AMTIz","role":"Administrator","active":True}],
    "metrics": {"m1":"500+","m2":"34","m3":"18","m4":"98%"},
}


# ──────────────────────────────────────────────────────────────
# DATABASE
# ──────────────────────────────────────────────────────────────
def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create tables, seed on first run, and repair corrupted/empty critical fields."""
    conn = get_db()
    cur  = conn.cursor()

    # Single key-value table — stores each top-level key as JSON
    cur.execute("""
        CREATE TABLE IF NOT EXISTS store (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    """)
    conn.commit()

    # Seed only when the store is completely empty
    cur.execute("SELECT COUNT(*) FROM store")
    if cur.fetchone()[0] == 0:
        for key, value in DEFAULT_DATA.items():
            cur.execute(
                "INSERT INTO store (key, value) VALUES (?, ?)",
                (key, json.dumps(value, ensure_ascii=False)),
            )
        conn.commit()
        print("[init_db] Database seeded with default data.")
    else:
        # Repair: restore any critical list that was accidentally emptied.
        # Protects against a bad POST /data that wiped heroImages, services, or projects.
        critical_lists = ["heroImages", "projects", "services"]
        for key in critical_lists:
            row = cur.execute("SELECT value FROM store WHERE key = ?", (key,)).fetchone()
            stored = json.loads(row[0]) if row else None
            if stored is None or stored == []:
                default_val = DEFAULT_DATA.get(key, [])
                cur.execute(
                    "INSERT INTO store (key, value) VALUES (?, ?) "
                    "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                    (key, json.dumps(default_val, ensure_ascii=False)),
                )
                print(f"[init_db] Repaired empty '{key}' — restored {len(default_val)} default items.")
        conn.commit()

    conn.close()


def db_get(key: str) -> Any:
    conn = get_db()
    row  = conn.execute("SELECT value FROM store WHERE key = ?", (key,)).fetchone()
    conn.close()
    return json.loads(row["value"]) if row else None


def db_set(key: str, value: Any):
    conn = get_db()
    conn.execute(
        "INSERT INTO store (key, value) VALUES (?, ?) "
        "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        (key, json.dumps(value, ensure_ascii=False)),
    )
    conn.commit()
    conn.close()


def db_get_all() -> dict:
    conn = get_db()
    rows = conn.execute("SELECT key, value FROM store").fetchall()
    conn.close()
    return {r["key"]: json.loads(r["value"]) for r in rows}


# ──────────────────────────────────────────────────────────────
# APP LIFECYCLE
# ──────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title="RodricksRestorations API", lifespan=lifespan)

# CORS — allow your frontend origin (update in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # tighten to your Vercel URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images as static files at /uploads/<filename>
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


# ──────────────────────────────────────────────────────────────
# ROUTES
# ──────────────────────────────────────────────────────────────

@app.get("/data")
def get_data():
    """Return all site data as a single JSON object."""
    return db_get_all()


@app.post("/data")
async def save_data(request: Request):
    """
    Accept full data object and persist every top-level key.
    Frontend POSTs: { heroImages, projects, services, messages, users, metrics }
    """
    # ── 1. Parse body ──────────────────────────────────────────
    raw = await request.body()
    if not raw:
        raise HTTPException(status_code=400, detail="Request body is empty")

    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {exc.msg}")

    # ── 2. Must be a plain object, not array / null / string ───
    if not isinstance(payload, dict):
        raise HTTPException(
            status_code=422,
            detail=f"Expected a JSON object, got {type(payload).__name__}",
        )

    # ── 3. Debug log — remove in production if desired ─────────
    print(f"[POST /data] keys received: {list(payload.keys())}")

    # ── 4. Persist only whitelisted keys, with empty-array protection ──
    allowed_keys = {"heroImages", "projects", "services", "messages", "users", "metrics"}
    # Lists that must NEVER be overwritten with an empty array.
    # If the frontend sends an empty value for these, we keep whatever is in the DB.
    critical_lists = {"heroImages", "projects", "services"}

    saved = []
    skipped = []
    for key, value in payload.items():
        if key not in allowed_keys:
            continue
        if key in critical_lists and isinstance(value, list) and len(value) == 0:
            skipped.append(key)
            print(f"[POST /data] SKIPPED saving empty '{key}' — keeping existing DB value")
            continue
        db_set(key, value)
        saved.append(key)

    print(f"[POST /data] saved: {saved}, skipped: {skipped}")
    return {"ok": True, "saved": saved, "skipped": skipped}


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Accept a single image file, save to /uploads, return its URL.
    """
    # Validate extension
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Read and size-check
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE_MB} MB.",
        )

    # Save with a unique name to avoid collisions
    filename  = f"{uuid.uuid4().hex}{suffix}"
    dest      = UPLOADS_DIR / filename
    dest.write_bytes(contents)

    # Return the URL the frontend can use immediately
    return {"url": f"/uploads/{filename}"}


# ──────────────────────────────────────────────────────────────
# CONTACT FORM  (bonus — saves message directly to DB)
# ──────────────────────────────────────────────────────────────
@app.post("/contact")
async def contact(request: Request):
    """Save an inbound contact form message."""
    try:
        msg: dict = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    required = {"name", "email", "message"}
    if not required.issubset(msg.keys()):
        raise HTTPException(status_code=422, detail="Missing required fields: name, email, message")

    messages: list = db_get("messages") or []
    new_id = max((m.get("id", 0) for m in messages), default=0) + 1
    messages.append({
        "id":      new_id,
        "name":    msg.get("name", ""),
        "email":   msg.get("email", ""),
        "phone":   msg.get("phone", ""),
        "message": msg.get("message", ""),
        "date":    msg.get("date", ""),
        "read":    False,
    })
    db_set("messages", messages)
    return {"ok": True, "id": new_id}


# ──────────────────────────────────────────────────────────────
# HEALTH CHECK
# ──────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok"}