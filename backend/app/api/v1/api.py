from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    applicant,
    application,
    company,
    interview,
    jobs,
    notification,
    tags,
    jobmatchtest,
    matching  # Add this import
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(applicant.router, prefix="/applicants", tags=["applicants"])
api_router.include_router(application.router, prefix="/applications", tags=["applications"])
api_router.include_router(company.router, prefix="/companies", tags=["companies"])
api_router.include_router(interview.router, prefix="/interviews", tags=["interviews"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(notification.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(tags.router, prefix="/tags", tags=["tags"])
api_router.include_router(jobmatchtest.router, tags=["job-matches"])  # Add this line
api_router.include_router(matching.router, prefix="/matching", tags=["matching"])


