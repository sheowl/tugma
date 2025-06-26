from fastapi import APIRouter

from app.api.v1 import endpoints

api_router = APIRouter()

api_router.include_router(endpoints.auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(endpoints.applicant.router, tags=["applicants"])
api_router.include_router(endpoints.application.router, prefix="/applications", tags=["applications"])
api_router.include_router(endpoints.company.router, prefix="/companies", tags=["companies"])
api_router.include_router(endpoints.interview.router, tags=["interviews"])
api_router.include_router(endpoints.jobs.router, tags=["jobs"])
api_router.include_router(endpoints.notification.router, tags=["notifications"])
api_router.include_router(endpoints.tags.router, tags=["tags"])
