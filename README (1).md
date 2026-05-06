# RodricksRestorations — Backend Setup & Deployment Guide

## Folder Structure

```
project/
├── backend/                  ← this folder
│   ├── main.py               ← FastAPI app (all routes)
│   ├── requirements.txt      ← Python dependencies
│   ├── render.yaml           ← Render deployment config
│   ├── Procfile              ← Railway deployment config
│   ├── rodricks.db           ← SQLite database (auto-created on first run)
│   └── uploads/              ← uploaded images stored here
│
└── frontend/                 ← your existing static site
    ├── index.html            ← unchanged
    ├── style.css             ← unchanged
    ├── script.js             ← UPDATED (use the new version)
    └── (no more data.json needed)
```

---

## 1. Local Development

### Prerequisites
- Python 3.10+ installed
- `pip` available

### Steps

```bash
# 1. Go into the backend folder
cd backend

# 2. Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the server
uvicorn main:app --reload

# Server is now running at: http://localhost:8000
```

### Open your frontend
- Open `frontend/index.html` in a browser, OR
- Serve it with: `npx serve frontend` (requires Node)
- The frontend will automatically connect to `http://localhost:8000`

### Verify the API is working
- Open http://localhost:8000/data — should return all site data as JSON
- Open http://localhost:8000/docs — interactive API docs (Swagger UI)

---

## 2. Deploy Backend to Render (Free Tier)

### Steps

1. **Create a Render account** at https://render.com

2. **Create a new Git repo** (GitHub / GitLab) and push your `backend/` folder to it

3. **In Render dashboard:**
   - Click "New +" → "Web Service"
   - Connect your repo
   - Set **Root Directory** to `backend` (or `.` if backend is at root)
   - Set **Build Command**: `pip install -r requirements.txt`
   - Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Set **Instance Type**: Free

4. **Add a Disk** (critical — so uploads + database survive restarts):
   - In your service → "Disks" → Add Disk
   - Mount Path: `/data`
   - Size: 1 GB (free)

5. **Update `main.py`** to use the persistent disk path:
   Change these two lines at the top of `main.py`:
   ```python
   DB_PATH     = "/data/rodricks.db"
   UPLOADS_DIR = Path("/data/uploads")
   ```

6. **Deploy** — Render will give you a URL like:
   `https://rodricks-backend.onrender.com`

---

## 3. Deploy Frontend to Vercel (Free)

1. **Create a Vercel account** at https://vercel.com

2. **Push your `frontend/` folder to GitHub**

3. **In Vercel:**
   - Click "New Project" → import your repo
   - Set **Root Directory** to `frontend`
   - Click Deploy

4. **Set the backend URL in your frontend:**

   Option A — Edit `script.js` directly (simplest):
   ```js
   const API_URL = 'https://rodricks-backend.onrender.com';
   ```

   Option B — Use a Vercel environment variable (better for teams):
   - In Vercel → Settings → Environment Variables
   - Add: `VITE_BACKEND_URL = https://rodricks-backend.onrender.com`
   - Then in `index.html` before `<script src="script.js">`:
     ```html
     <script>window.BACKEND_URL = 'https://rodricks-backend.onrender.com';</script>
     ```
   - The `script.js` already reads `window.BACKEND_URL` if set.

5. **Redeploy** Vercel after setting the env variable.

---

## 4. CORS — Tightening for Production

When you go live, update the CORS config in `main.py` from `"*"` to your Vercel URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-site.vercel.app"],   # ← your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 5. API Reference

| Method | Endpoint   | Description                              |
|--------|------------|------------------------------------------|
| GET    | /data      | Returns all site data as JSON            |
| POST   | /data      | Saves full data object to SQLite         |
| POST   | /upload    | Uploads image file, returns `/uploads/filename.jpg` |
| POST   | /contact   | Saves contact form message to DB         |
| GET    | /health    | Health check — returns `{"status":"ok"}` |
| GET    | /docs      | Interactive Swagger UI (dev only)        |

### POST /data — Request body
```json
{
  "heroImages": ["https://..."],
  "projects":   [...],
  "services":   [...],
  "messages":   [...],
  "users":      [...],
  "metrics":    {"m1":"500+","m2":"34","m3":"18","m4":"98%"}
}
```

### POST /upload — Form data
```
file: <binary image file>
```
Returns:
```json
{ "url": "/uploads/abc123def456.jpg" }
```

---

## 6. How It Works (Architecture)

```
Browser (Vercel)
    │
    ├── GET  /data         ← loads all data on page open
    ├── POST /data         ← admin clicks Save
    ├── POST /upload       ← admin uploads image
    └── POST /contact      ← visitor submits contact form
         │
    FastAPI (Render)
         │
    SQLite DB (Render Disk)
    /data/rodricks.db      ← key-value store, all data as JSON
    /data/uploads/         ← image files
```

---

## 7. Admin Login

Default credentials:
- **Username**: `admin`
- **Password**: `admin123`

To change the password: log in as admin → Users → Delete old admin → Add new admin with new password → Save.

---

## 8. Troubleshooting

| Problem | Fix |
|---------|-----|
| Backend returns 404/connection refused | Make sure `uvicorn` is running |
| Images not loading after upload | Check `UPLOADS_DIR` path is correct and writable |
| Data resets after Render restart | Add the `/data` disk mount in Render settings |
| CORS error in browser | Update `allow_origins` in `main.py` with your frontend URL |
| "Save failed" notification | Check browser console for the actual error |
