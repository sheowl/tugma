# app/api/v1/endpoints/jobs.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.schemas.jobs import JobCreate, JobUpdate, JobOut
from app.crud import jobs as crud

router = APIRouter(prefix="/jobs", tags=["jobs"])

# Create a job
@router.post("/", response_model=JobOut)
async def create_job(job_in: JobCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_job(db, job_in)

# Get all jobs
@router.get("/", response_model=List[JobOut])
async def get_all_jobs(db: AsyncSession = Depends(get_db)):
    return await crud.get_all_jobs(db)

# Get a specific job by ID
@router.get("/{job_id}", response_model=JobOut)
async def get_job_by_id(job_id: int, db: AsyncSession = Depends(get_db)):
    job = await crud.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

# Get all jobs for a company
@router.get("/company/{company_id}", response_model=List[JobOut])
async def get_jobs_by_company(company_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_jobs_by_company(db, company_id)

# Update a job
@router.put("/{job_id}", response_model=JobOut)
async def update_job(job_id: int, job_update: JobUpdate, db: AsyncSession = Depends(get_db)):
    updated_job = await crud.update_job(db, job_id, job_update)
    if not updated_job:
        raise HTTPException(status_code=404, detail="Job not found")
    return updated_job

# Delete a job
@router.delete("/{job_id}")
async def delete_job(job_id: int, db: AsyncSession = Depends(get_db)):
    success = await crud.delete_job(db, job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted successfully"}
