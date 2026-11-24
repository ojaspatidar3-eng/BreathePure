import time
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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
    response.headers["Content-Security-Policy"] = "default-src 'self'"

    return response

# Mount API routers
app.include_router(aqi_router, prefix=settings.API_V1_STR)
app.include_router(assistant_router, prefix=settings.API_V1_STR)
app.include_router(prompts_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
