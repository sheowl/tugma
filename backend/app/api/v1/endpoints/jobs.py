# app/api/v1/endpoints/jobs.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.schemas.jobs import JobCreate, JobUpdate, JobOut, CompanyJobsResponse
from app.crud import jobs as crud
from app.middleware.auth import get_current_company

router = APIRouter()

#====================== Authenticated Routes (MUST BE FIRST) ================

# Get all jobs posted by the current authenticated company with total count
@router.get("/my-jobs", response_model=CompanyJobsResponse)
async def get_my_company_jobs_with_total(
    current_company: dict = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Get all jobs posted by the current authenticated company with total count"""
    try:
        company_id = current_company["db_user"].company_id
        
        print(f"🔍 DEBUG: Getting jobs for company_id: {company_id}")
        
        jobs = await crud.get_jobs_by_company(db, company_id)
        
        print(f"🔍 DEBUG: Found {len(jobs)} jobs")
        
        # Convert to JobOut objects (Pydantic will handle serialization)
        jobs_out = [JobOut.model_validate(job) for job in jobs]
        
        return CompanyJobsResponse(
            jobs=jobs_out,
            total=len(jobs_out),
            company_info={
                "company_name": current_company["db_user"].company_name,
                "company_size": current_company["db_user"].company_size,
                "location": current_company["db_user"].location
            }
        )
        
    except Exception as e:
        print(f"❌ DEBUG: Error in get_my_company_jobs_with_total: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

# Create a new job (authenticated)
@router.post("/my-jobs", response_model=JobOut)
async def create_my_job(
    job_in: JobCreate,
    current_company: dict = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Create a new job for the current authenticated company"""
    try:
        # Match the pattern from company.py
        company_id = current_company["db_user"].company_id
        
        print(f"🔍 DEBUG: Creating job for company_id: {company_id}")
        
        # Set the company_id in the job data
        job_data = job_in.dict()
        job_data["company_id"] = company_id
        
        # Create the job with the modified data
        job_create = JobCreate(**job_data)
        new_job = await crud.create_job(db, job_create)
        
        print(f"🔍 DEBUG: Job created successfully: {new_job.job_id}")
        
        return new_job
        
    except Exception as e:
        print(f"❌ DEBUG: Error in create_my_job: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

# Get details of a specific job posted by the current authenticated company
@router.get("/my-jobs/{job_id}", response_model=JobOut)
async def get_my_job_details(
    job_id: int,
    current_company: dict = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Get details of a specific job posted by the current authenticated company"""
    try:
        company_id = current_company["db_user"].company_id
        
        print(f"🔍 DEBUG: Getting job {job_id} for company_id: {company_id}")
        
        job = await crud.get_job_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Verify that this job belongs to the current company
        if job.company_id != company_id:
            raise HTTPException(status_code=403, detail="Access denied. This job doesn't belong to your company")
        
        return job
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ DEBUG: Error in get_my_job_details: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

# Update a job (authenticated)
@router.put("/my-jobs/{job_id}", response_model=JobOut)
async def update_my_job(
    job_id: int,
    job_update: JobUpdate,
    current_company: dict = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Update a specific job posted by the current authenticated company"""
    try:
        company_id = current_company["db_user"].company_id
        
        print(f"🔍 DEBUG: Updating job {job_id} for company_id: {company_id}")
        
        # First check if the job exists and belongs to the current company
        job = await crud.get_job_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        if job.company_id != company_id:
            raise HTTPException(status_code=403, detail="Access denied. This job doesn't belong to your company")
        
        # Update the job
        updated_job = await crud.update_job(db, job_id, job_update)
        if not updated_job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        print(f"🔍 DEBUG: Job updated successfully: {job_id}")
        
        return updated_job
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ DEBUG: Error in update_my_job: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

# Delete a job (authenticated)
@router.delete("/my-jobs/{job_id}")
async def delete_my_job(
    job_id: int,
    current_company: dict = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Delete a specific job posted by the current authenticated company"""
    try:
        company_id = current_company["db_user"].company_id
        
        print(f"🔍 DEBUG: Deleting job {job_id} for company_id: {company_id}")
        
        # First check if the job exists and belongs to the current company
        job = await crud.get_job_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        if job.company_id != company_id:
            raise HTTPException(status_code=403, detail="Access denied. This job doesn't belong to your company")
        
        # Delete the job
        success = await crud.delete_job(db, job_id)
        if not success:
            raise HTTPException(status_code=404, detail="Job not found")
        
        print(f"🔍 DEBUG: Job deleted successfully: {job_id}")
        
        return {"message": "Job deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ DEBUG: Error in delete_my_job: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

#====================== Public Routes (AFTER SPECIFIC ROUTES) ===============

# Create a job (public)
@router.post("/", response_model=JobOut)
async def create_job(job_in: JobCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_job(db, job_in)

# Get all jobs (public)
@router.get("/", response_model=List[JobOut])
async def get_all_jobs(db: AsyncSession = Depends(get_db)):
    return await crud.get_all_jobs(db)

# Get all jobs for a company (public)
@router.get("/company/{company_id}", response_model=List[JobOut])
async def get_jobs_by_company(company_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_jobs_by_company(db, company_id)

# Get a specific job by ID (public) - MUST BE LAST
@router.get("/{job_id}", response_model=JobOut)
async def get_job_by_id(job_id: int, db: AsyncSession = Depends(get_db)):
    job = await crud.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

# Update a job (public)
@router.put("/{job_id}", response_model=JobOut)
async def update_job(job_id: int, job_update: JobUpdate, db: AsyncSession = Depends(get_db)):
    updated_job = await crud.update_job(db, job_id, job_update)
    if not updated_job:
        raise HTTPException(status_code=404, detail="Job not found")
    return updated_job

# Delete a job (public)
@router.delete("/{job_id}")
async def delete_job(job_id: int, db: AsyncSession = Depends(get_db)):
    success = await crud.delete_job(db, job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted successfully"}

