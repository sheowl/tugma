from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.matching_service import MatchingService
from app.middleware.auth import get_current_applicant

router = APIRouter(prefix="/matching", tags=["matching"])

@router.get("/jobs")
async def get_jobs_with_match_scores(
    db: AsyncSession = Depends(get_db),
    current_applicant: dict = Depends(get_current_applicant),
):
    try:
        applicant_id = current_applicant["db_user"].applicant_id
        print("Applicant ID:", applicant_id)
        jobs_with_scores = await MatchingService.get_jobs_with_match_scores(
            db, applicant_id
        )
        print("Jobs with scores:", jobs_with_scores)
        return {
            "jobs": jobs_with_scores,
            "total_jobs": len(jobs_with_scores)
        }
    except Exception as e:
        print("Error in matching endpoint:", e)
        return {"jobs": [], "total_jobs": 0, "error": str(e)}

@router.get("/applicants/{job_id}")
async def get_applicants_with_match_scores(
    job_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get all applicants with match scores for a job (Employer endpoint)"""
    try:
        applicants_with_scores = await MatchingService.get_applicants_with_match_scores(
            db, job_id
        )
        
        return {
            "applicants": applicants_with_scores,
            "job_id": job_id,
            "total_applicants": len(applicants_with_scores)
        }
        
    except Exception as e:
        return {"error": str(e)}

@router.get("/score/{applicant_id}/{job_id}")
async def get_specific_match_score(
    applicant_id: int,
    job_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get specific match score between an applicant and job"""
    try:
        match_score = await MatchingService.calculate_job_match_score(
            db, applicant_id, job_id
        )
        
        return {
            "applicant_id": applicant_id,
            "job_id": job_id,
            "match_score": round(match_score),
            "formula": "Match Score = (|A ∩ J| / |J|) * 70% + (|A ∩ J| / |A|) * 30%"
        }
        
    except Exception as e:
        return {"error": str(e)}