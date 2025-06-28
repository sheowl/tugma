from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from enum import Enum

from app.schemas.application import (
    JobApplicationCreate,
    JobApplicationUpdate,
    JobApplicationOut
)
from app.schemas.interview import InterviewDetailsCreate
from app.crud import application as crud
from app.crud import interview as interview_crud
from app.core.database import get_db
from app.middleware.auth import get_current_company  # Add this import

router = APIRouter()

class ApplicationStatus(str, Enum):
    APPLIED = "applied"
    INTERVIEW = "interview"
    REJECTED = "rejected"
    ACCEPTED = "accepted"

class InterviewType(str, Enum):
    ONSITE = "onsite"
    ONLINE = "online"

class InterviewStatus(str, Enum):
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

# Create a job application
@router.post("/", response_model=JobApplicationOut)
async def create_application(application: JobApplicationCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_job_application(db, application)

# Get all applications for a specific applicant
@router.get("/applicant/{applicant_id}", response_model=List[JobApplicationOut])
async def get_applications_by_applicant(applicant_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_applications_by_applicant(db, applicant_id)

# Get a specific application using applicant_id and job_id
@router.get("/{applicant_id}/{job_id}", response_model=JobApplicationOut)
async def get_application(applicant_id: int, job_id: int, db: AsyncSession = Depends(get_db)):
    application = await crud.get_application(db, applicant_id, job_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

# Update the status of an application (non-authenticated - existing endpoint)
@router.put("/{applicant_id}/{job_id}", response_model=JobApplicationOut)
async def update_application_status(
    applicant_id: int, job_id: int,
    updates: JobApplicationUpdate,
    db: AsyncSession = Depends(get_db)
):
    updated = await crud.update_application_status(db, applicant_id, job_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail="Application not found")
    return updated

# NEW: Company authenticated status update endpoint
@router.put("/company/status/{applicant_id}/{job_id}")
async def update_application_status_by_company(
    applicant_id: int,
    job_id: int,
    status: ApplicationStatus,
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """
    Update application status - Only accessible by authenticated companies
    who own the job posting
    """
    try:
        company_id = company_info["db_user"].company_id
        
        print(f"🔍 DEBUG: Company {company_id} updating application status for applicant {applicant_id} on job {job_id} to '{status}'")
        
        # Verify that the job belongs to the authenticated company
        job_verification = await crud.verify_job_ownership(db, job_id, company_id)
        if not job_verification:
            raise HTTPException(
                status_code=403,
                detail="Access denied. You can only update applications for your own job postings"
            )
        
        # Update the application status
        updated = await crud.update_application_status_by_company(
            db, applicant_id, job_id, status.value, company_id
        )
        
        if not updated:
            raise HTTPException(
                status_code=404, 
                detail="Application not found"
            )
        
        return {
            "message": f"Application status updated to '{status}' successfully",
            "applicant_id": applicant_id,
            "job_id": job_id,
            "new_status": status.value,
            "updated_by_company": company_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to update application status: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

# NEW: Update application status with interview creation capability
@router.put("/company/status/{applicant_id}/{job_id}")
async def update_application_status_with_workflow(
    applicant_id: int,
    job_id: int,
    status: ApplicationStatus,
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """
    Update application status - If status is 'interview', frontend should call
    interview creation endpoint next with predefined remarks
    """
    try:
        company_id = company_info["db_user"].company_id
        
        print(f"🔍 DEBUG: Company {company_id} updating application status for applicant {applicant_id} on job {job_id} to '{status}'")
        
        # Verify job ownership
        job_verification = await crud.verify_job_ownership(db, job_id, company_id)
        if not job_verification:
            raise HTTPException(
                status_code=403,
                detail="Access denied. You can only update applications for your own job postings"
            )
        
        # Update the application status
        updated = await crud.update_application_status_by_company(
            db, applicant_id, job_id, status.value, company_id
        )
        
        if not updated:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Prepare response with next steps
        response = {
            "message": f"Application status updated to '{status}' successfully",
            "applicant_id": applicant_id,
            "job_id": job_id,
            "new_status": status.value,
            "updated_by_company": company_id
        }
        
        # Add predefined remarks for interview status
        if status == ApplicationStatus.INTERVIEW:
            response["next_step"] = "create_interview"
            response["predefined_remarks"] = generate_predefined_interview_remarks(applicant_id, job_id)
            response["interview_endpoint"] = "/api/v1/interviews/"
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to update application status: {e}")
        raise HTTPException(status_code=400, detail=str(e))

def generate_predefined_interview_remarks(applicant_id: int, job_id: int) -> str:
    """Generate predefined remarks for interview scheduling"""
    return f"Interview scheduled for applicant {applicant_id} for job {job_id}. Please prepare your portfolio and arrive 15 minutes early. Contact HR if you need to reschedule."

