import os
import time
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.api.routes_aqi import router as aqi_router
from app.api.routes_assistant import router as assistant_router
from app.api.routes_prompts import router as prompts_router
from app.api.routes_profile import router as profile_router

app = FastAPI(
    title="BreathePure API",
    description="Smarter Air. Healthier Life. Production-grade GenAI Urban Air Quality Assistant.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lightweight rate limiter / security header middleware
# Keeps track of requests per IP to protect against abuse while remaining fast
REQUEST_HISTORY: dict[str, list[float]] = {}
RATE_LIMIT_PER_MINUTE = 120

@app.middleware("http")
async def security_and_rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()

    # Rate limiting
    if client_ip not in REQUEST_HISTORY:
        REQUEST_HISTORY[client_ip] = []
    # Purge timestamps older than 60 seconds
    REQUEST_HISTORY[client_ip] = [t for t in REQUEST_HISTORY[client_ip] if now - t < 60]

    if len(REQUEST_HISTORY[client_ip]) >= RATE_LIMIT_PER_MINUTE:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please slow down."}
        )
    REQUEST_HISTORY[client_ip].append(now)

    # Process request
    response: Response = await call_next(request)

    # Add standard security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com data:; "
        "img-src 'self' data: https:; "
        "connect-src 'self'"
    )

    return response

# Locate frontend production build directory
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
ASSETS_DIR = os.path.join(FRONTEND_DIST, "assets")

# Mount API routers
app.include_router(aqi_router, prefix=settings.API_V1_STR)
app.include_router(assistant_router, prefix=settings.API_V1_STR)
app.include_router(prompts_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)

# Mount static assets if build exists
if os.path.isdir(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

@app.get("/")
async def root(request: Request):
    index_path = os.path.join(FRONTEND_DIST, "index.html")
    accept = request.headers.get("accept", "")
    # Serve React SPA HTML when requested by a browser and built frontend is present
    if "text/html" in accept and os.path.isfile(index_path):
        return FileResponse(index_path)
    # Default to operational status JSON for API clients & tests
    return {
        "product": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "version": settings.VERSION,
        "status": "operational",
        "documentation": "/docs",
        "mode": "Live Gemini Enabled" if settings.GEMINI_API_KEY else "Deterministic Demo Mode"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }

# SPA client-side routing fallback (for direct browser URLs like /dashboard, /assistant, etc.)
@app.get("/{full_path:path}")
async def serve_spa_fallback(full_path: str):
    # Guard API routes from catch-all fallback
    if full_path.startswith("api/") or full_path == "api":
        return JSONResponse(status_code=404, content={"detail": "API endpoint not found"})

    # Check for direct static file in dist (e.g. favicon.ico, vite.svg)
    file_path = os.path.join(FRONTEND_DIST, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)

    # Return index.html for client-side routing
    index_path = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path)

    return JSONResponse(status_code=404, content={"detail": f"Path '/{full_path}' not found"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
