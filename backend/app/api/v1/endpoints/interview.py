# app/api/v1/endpoints/interview.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from enum import Enum

from app.schemas.interview import InterviewDetailsCreate, InterviewDetailsUpdate, InterviewDetailsOut
from app.crud import interview as crud
from app.crud import application as app_crud
from app.core.database import get_db
from app.middleware.auth import get_current_company

router = APIRouter()

class InterviewType(str, Enum):
    ONSITE = "onsite"
    ONLINE = "online"

class InterviewStatus(str, Enum):
    CONFIRMED = "comfirmed"
    CANCELLED = "cancelled"

# Create interview (Company authenticated)
@router.post("/", response_model=InterviewDetailsOut)
async def create_interview(
    interview: InterviewDetailsCreate, 
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """
    Create interview details - Only accessible by authenticated companies
    who own the job posting. Application status should be 'interview' first.
    """
    try:
        company_id = company_info["db_user"].company_id
        
        print(f"DEBUG: Company {company_id} creating interview for applicant {interview.applicant_id} on job {interview.job_id}")
        
        # Verify job ownership
        job_verification = await app_crud.verify_job_ownership(db, interview.job_id, company_id)
        if not job_verification:
            raise HTTPException(
                status_code=403,
                detail="Access denied. You can only create interviews for your own job postings"
            )
        
        # Verify application status is 'interview'
        application_check = await app_crud.verify_application_interview_status(
            db, interview.applicant_id, interview.job_id
        )
        if not application_check:
            raise HTTPException(
                status_code=400,
                detail="Application status must be 'interview' before creating interview details"
            )
        
        # Check if interview already exists
        existing_interview = await crud.get_interview(db, interview.applicant_id, interview.job_id)
        if existing_interview:
            raise HTTPException(
                status_code=400,
                detail="Interview details already exist for this application"
            )
        
        # Create the interview
        created_interview = await crud.create_interview(db, interview)
        
        print(f"DEBUG: Interview created successfully")
        return created_interview
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to create interview: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# Update interview (Company authenticated)
@router.put("/{applicant_id}/{job_id}", response_model=InterviewDetailsOut)
async def update_interview(
    applicant_id: int,
    job_id: int,
    updates: InterviewDetailsUpdate,
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """
    Update interview details - Only accessible by authenticated companies
    who own the job posting
    """
    try:
        company_id = company_info["db_user"].company_id
        
        # Verify job ownership
        job_verification = await app_crud.verify_job_ownership(db, job_id, company_id)
        if not job_verification:
            raise HTTPException(
                status_code=403,
                detail="Access denied. You can only update interviews for your own job postings"
            )
        
        updated = await crud.update_interview(db, applicant_id, job_id, updates)
        if not updated:
            raise HTTPException(status_code=404, detail="Interview not found")
        
        return updated
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to update interview: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# Get interview (Company authenticated)
@router.get("/{applicant_id}/{job_id}", response_model=InterviewDetailsOut)
async def get_interview(
    applicant_id: int, 
    job_id: int, 
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """
    Get interview details - Only accessible by authenticated companies
    who own the job posting
    """
    try:
        company_id = company_info["db_user"].company_id
        
        # Verify job ownership
        job_verification = await app_crud.verify_job_ownership(db, job_id, company_id)
        if not job_verification:
            raise HTTPException(
                status_code=403,
                detail="Access denied. You can only view interviews for your own job postings"
            )
        
        interview = await crud.get_interview(db, applicant_id, job_id)
        if not interview:
            raise HTTPException(status_code=404, detail="Interview not found")
        
        return interview
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to get interview: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# Get all interviews for company's jobs
@router.get("/company/all", response_model=List[InterviewDetailsOut])
async def get_company_interviews(
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all interviews for jobs posted by the authenticated company
    """
    try:
        company_id = company_info["db_user"].company_id
        interviews = await crud.get_interviews_by_company(db, company_id)
        return interviews
        
    except Exception as e:
        print(f"ERROR: Failed to get company interviews: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# Delete interview (Company authenticated)
@router.delete("/{applicant_id}/{job_id}", status_code=204)
async def delete_interview(
    applicant_id: int, 
    job_id: int, 
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete interview details - Only accessible by authenticated companies
    who own the job posting
    """
    try:
        company_id = company_info["db_user"].company_id
        
        # Verify job ownership
        job_verification = await app_crud.verify_job_ownership(db, job_id, company_id)
        if not job_verification:
            raise HTTPException(
                status_code=403,
                detail="Access denied. You can only delete interviews for your own job postings"
            )
        
        deleted = await crud.delete_interview(db, applicant_id, job_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Interview not found")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to delete interview: {e}")
        raise HTTPException(status_code=400, detail=str(e))

