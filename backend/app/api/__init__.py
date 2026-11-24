from app.api.routes_aqi import router as aqi_router
from app.api.routes_assistant import router as assistant_router
from app.api.routes_prompts import router as prompts_router
from app.api.routes_profile import router as profile_router

__all__ = [
    "aqi_router",
    "assistant_router",
    "prompts_router",
    "profile_router"
]
