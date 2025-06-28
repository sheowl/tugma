from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.api.v1.api import api_router

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Startup
#     print("Starting up Tugma API...")
#     await init_db()
#     yield
#     # Shutdown
#     print("Shutting down Tugma API...")


# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Job Matching Platform for Entry-Level Tech Professionals",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=settings.ALLOWED_METHODS,
    allow_headers=settings.ALLOWED_HEADERS,
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "message": "Welcome to Tugma API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "tugma-api"}


# Add this endpoint after the health check
@app.get("/debug/cors")
async def debug_cors():
    return {
        "allowed_origins": settings.ALLOWED_ORIGINS if hasattr(settings, 'ALLOWED_ORIGINS') else "Not found",
        "allowed_methods": settings.ALLOWED_METHODS if hasattr(settings, 'ALLOWED_METHODS') else "Not found",
        "allowed_headers": settings.ALLOWED_HEADERS if hasattr(settings, 'ALLOWED_HEADERS') else "Not found",
        "type_origins": type(settings.ALLOWED_ORIGINS).__name__ if hasattr(settings, 'ALLOWED_ORIGINS') else "Not found"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )