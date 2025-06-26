from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.application import (
    JobApplicationCreate,
    JobApplicationUpdate,
    JobApplicationOut
)
from app.crud import application as crud
from app.core.database import get_db

router = APIRouter()

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

# Update the status of an application
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

