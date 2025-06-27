from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.matching_service import MatchingService
from app.middleware.auth import get_current_applicant

router = APIRouter(prefix="/matching", tags=["matching"])

@router.get("/jobs")
async def get_jobs_with_detailed_match_scores(
    db: AsyncSession = Depends(get_db),
    current_applicant: dict = Depends(get_current_applicant),
):
    """Get all jobs with detailed match scores using hashing algorithm"""
    try:
        applicant_id = current_applicant["db_user"].applicant_id
        print(f"🔍 Getting detailed job matches for applicant {applicant_id}")
                
        jobs_with_detailed_scores = await MatchingService.get_jobs_with_detailed_match_scores(
            db, applicant_id
        )
        
        print(f"🔍 Found {len(jobs_with_detailed_scores)} jobs with detailed scores")
        
        return {
            "jobs": jobs_with_detailed_scores,
            "total_jobs": len(jobs_with_detailed_scores),
            "applicant_id": applicant_id
        }
        
    except Exception as e:
        print(f"❌ Error in detailed matching endpoint: {e}")
        import traceback
        traceback.print_exc()
        return {"jobs": [], "total_jobs": 0, "error": str(e)}

@router.get("/job/{job_id}/details")
async def get_job_match_details(
    job_id: int,
    db: AsyncSession = Depends(get_db),
    current_applicant: dict = Depends(get_current_applicant),
):
    """Get detailed match breakdown for a specific job"""
    try:
        applicant_id = current_applicant["db_user"].applicant_id
                
        match_details = await MatchingService.calculate_job_match_score_with_details(
            db, applicant_id, job_id
        )
        
        return {
            "job_id": job_id,
            "applicant_id": applicant_id,
            **match_details
        }
        
    except Exception as e:
        return {"error": str(e)}

@router.get("/debug/jobs-count")
async def debug_jobs_count(db: AsyncSession = Depends(get_db)):
    """Debug endpoint to check job count"""
    try:
        from app.crud import jobs as jobs_crud
        
        # Check total jobs
        all_jobs = await jobs_crud.get_all_active_jobs(db)
        
        return {
            "total_jobs": len(all_jobs),
            "job_titles": [job.job_title for job in all_jobs[:5]]  # First 5 titles
        }
    except Exception as e:
        print(f"❌ Debug endpoint error: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

