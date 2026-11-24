import sys
import os
import uvicorn

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8000"))
    reload_mode = os.environ.get("ENVIRONMENT", "production").lower() != "production"
    uvicorn.run("app.main:app", host=host, port=port, reload=reload_mode)
