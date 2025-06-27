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
    """Get all jobs posted by the current authenticated company with total count and applicant counts"""
    try:
        company_id = current_company["db_user"].company_id
        
        print(f"DEBUG: Getting jobs for company_id: {company_id}")
        
        jobs = await crud.get_jobs_by_company(db, company_id)
        
        print(f"DEBUG: Found {len(jobs)} jobs")
        
        # Convert to JobOut objects with simplified job tags
        jobs_out = []
        for job in jobs:
            # Get applicant count for this job
            applicant_count = await crud.get_applicant_count_by_job(db, job.job_id)
            
            # Get job tags for this job (now just array of tag IDs)
            job_tags = await crud.get_job_tags(db, job.job_id)
            
            # Build job dict with simplified structure
            job_dict = {
                "job_id": job.job_id,
                "job_title": job.job_title,
                "company_id": job.company_id,
                "salary_min": int(job.salary_min) if job.salary_min else 0,
                "salary_max": int(job.salary_max) if job.salary_max else 0,
                "setting": job.setting,
                "work_type": job.work_type,
                "description": job.description,
                "date_added": job.date_added,
                "created_at": job.created_at,
                "position_count": int(job.position_count) if job.position_count else 1,
                "required_category_id": int(job.required_category_id) if job.required_category_id else None,
                "required_proficiency": int(job.required_proficiency) if job.required_proficiency else None,
                "applicant_count": applicant_count,
                "job_tags": job_tags  # Now just array of tag IDs
            }
            
            print(f"DEBUG: Processing job {job.job_id} - applicants: {applicant_count}, tags: {job_tags}")
            
            jobs_out.append(JobOut(**job_dict))
        
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
        print(f"DEBUG: Error in get_my_company_jobs_with_total: {e}")
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
        
        print(f"DEBUG: Creating job for company_id: {company_id}")
        print(f"DEBUG: Input salary_min: {job_in.salary_min}, salary_max: {job_in.salary_max}")
        print(f"DEBUG: Job tag IDs: {job_in.job_tags}")  # Now just tag IDs
        
        # Set the company_id in the job data and ensure proper integer conversion
        job_data = job_in.model_dump()
        job_data["company_id"] = company_id
        
        # Explicitly convert salary values to integers
        job_data["salary_min"] = int(job_data["salary_min"]) if job_data.get("salary_min") else 0
        job_data["salary_max"] = int(job_data["salary_max"]) if job_data.get("salary_max") else 0
        
        print(f"DEBUG: Processed salary_min: {job_data['salary_min']}, salary_max: {job_data['salary_max']}")
        
        # Create the job with the modified data (tags will be set to required=True automatically)
        job_create = JobCreate(**job_data)
        new_job = await crud.create_job(db, job_create)
        
        # Get the job tags for the response
        job_tags = await crud.get_job_tags(db, new_job.job_id)
        
        print(f"DEBUG: Job created successfully: {new_job.job_id}")
        print(f"DEBUG: Created job salary_min: {new_job.salary_min}, salary_max: {new_job.salary_max}")
        print(f"DEBUG: Job tags created: {len(job_tags)} (all set to required=True)")
        
        # Return job with tags (all will have is_required=True)
        job_out_dict = {
            "job_id": new_job.job_id,
            "job_title": new_job.job_title,
            "company_id": new_job.company_id,
            "salary_min": int(new_job.salary_min) if new_job.salary_min else 0,
            "salary_max": int(new_job.salary_max) if new_job.salary_max else 0,
            "setting": new_job.setting,
            "work_type": new_job.work_type,
            "description": new_job.description,
            "date_added": new_job.date_added,
            "created_at": new_job.created_at,
            "position_count": int(new_job.position_count) if new_job.position_count else 1,
            "required_category_id": int(new_job.required_category_id) if new_job.required_category_id else None,
            "required_proficiency": int(new_job.required_proficiency) if new_job.required_proficiency else None,
            "applicant_count": 0,  # New job has no applicants yet
            "job_tags": job_tags  # Now just array of tag IDs
        }
        
        return JobOut(**job_out_dict)
        
    except Exception as e:
        print(f"DEBUG: Error in create_my_job: {e}")
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
        
        print(f"DEBUG: Getting job {job_id} for company_id: {company_id}")
        
        job = await crud.get_job_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Verify that this job belongs to the current company
        if job.company_id != company_id:
            raise HTTPException(status_code=403, detail="Access denied. This job doesn't belong to your company")
        
        # Get job tags and applicant count
        job_tags = await crud.get_job_tags(db, job_id)
        applicant_count = await crud.get_applicant_count_by_job(db, job_id)
        
        # Build response with tags
        job_out_dict = {
            "job_id": job.job_id,
            "job_title": job.job_title,
            "company_id": job.company_id,
            "salary_min": int(job.salary_min) if job.salary_min else 0,
            "salary_max": int(job.salary_max) if job.salary_max else 0,
            "setting": job.setting,
            "work_type": job.work_type,
            "description": job.description,
            "date_added": job.date_added,
            "created_at": job.created_at,
            "position_count": int(job.position_count) if job.position_count else 1,
            "required_category_id": int(job.required_category_id) if job.required_category_id else None,
            "required_proficiency": int(job.required_proficiency) if job.required_proficiency else None,
            "applicant_count": applicant_count,
            "job_tags": job_tags  # Now just array of tag IDs
        }
        
        return JobOut(**job_out_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"DEBUG: Error in get_my_job_details: {e}")
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
        
        print(f"DEBUG: Updating job {job_id} for company_id: {company_id}")
        print(f"DEBUG: Job tag IDs to update: {job_update.job_tags}")  # Now just tag IDs
        
        # First check if the job exists and belongs to the current company
        job = await crud.get_job_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        if job.company_id != company_id:
            raise HTTPException(status_code=403, detail="Access denied. This job doesn't belong to your company")
        
        # Update the job (tags will be set to required=True automatically)
        updated_job = await crud.update_job(db, job_id, job_update)
        if not updated_job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Get updated job tags and applicant count
        job_tags = await crud.get_job_tags(db, job_id)
        applicant_count = await crud.get_applicant_count_by_job(db, job_id)
        
        print(f"DEBUG: Job updated successfully: {job_id}")
        print(f"DEBUG: Updated job tags: {len(job_tags)} (all set to required=True)")
        
        # Build response with updated tags
        job_out_dict = {
            "job_id": updated_job.job_id,
            "job_title": updated_job.job_title,
            "company_id": updated_job.company_id,
            "salary_min": int(updated_job.salary_min) if updated_job.salary_min else 0,
            "salary_max": int(updated_job.salary_max) if updated_job.salary_max else 0,
            "setting": updated_job.setting,
            "work_type": updated_job.work_type,
            "description": updated_job.description,
            "date_added": updated_job.date_added,
            "created_at": updated_job.created_at,
            "position_count": int(updated_job.position_count) if updated_job.position_count else 1,
            "required_category_id": int(updated_job.required_category_id) if updated_job.required_category_id else None,
            "required_proficiency": int(updated_job.required_proficiency) if updated_job.required_proficiency else None,
            "applicant_count": applicant_count,
            "job_tags": job_tags  # Now just array of tag IDs
        }
        
        return JobOut(**job_out_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"DEBUG: Error in update_my_job: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

# Delete a job (authenticated) - job tags are automatically deleted by CRUD
@router.delete("/my-jobs/{job_id}")
async def delete_my_job(
    job_id: int,
    current_company: dict = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Delete a specific job posted by the current authenticated company"""
    try:
        company_id = current_company["db_user"].company_id
        
        print(f"DEBUG: Deleting job {job_id} for company_id: {company_id}")
        
        # First check if the job exists and belongs to the current company
        job = await crud.get_job_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        if job.company_id != company_id:
            raise HTTPException(status_code=403, detail="Access denied. This job doesn't belong to your company")
        
        # Delete the job (CRUD will handle deleting job tags first)
        success = await crud.delete_job(db, job_id)
        if not success:
            raise HTTPException(status_code=404, detail="Job not found")
        
        print(f"DEBUG: Job and its tags deleted successfully: {job_id}")
        
        return {"message": "Job and associated tags deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"EBUG: Error in delete_my_job: {e}")
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

# Get applicants for a specific job posted by the current authenticated company
@router.get("/my-jobs/{job_id}/applicants")
async def get_my_job_applicants(
    job_id: int,
    current_company: dict = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Get all applicants for a specific job posted by the current authenticated company"""
    try:
        company_id = current_company["db_user"].company_id
        
        print(f"DEBUG: Getting applicants for job {job_id} from company_id: {company_id}")
        
        # First verify that this job belongs to the current company
        job = await crud.get_job_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        if job.company_id != company_id:
            raise HTTPException(status_code=403, detail="Access denied. This job doesn't belong to your company")
        
        # Get applicants for this job
        applicants = await crud.get_applicants_by_job(db, job_id)
        
        print(f"DEBUG: Found {len(applicants)} applicants for job {job_id}")
        
        # Format applicant data with tags and match scores
        applicants_data = []
        for applicant in applicants:
            # Get applicant tags (array of tag IDs)
            applicant_tags = await crud.get_applicant_tags(db, applicant.applicant_id)
            
            # Get or calculate match score
            match_score = await crud.get_match_score(db, applicant.applicant_id, job_id)
            
            applicant_info = {
                "applicant_id": applicant.applicant_id,
                "job_id": applicant.job_id,
                "name": f"{applicant.first_name} {applicant.last_name}",
                "applicant_email": applicant.applicant_email,
                "phone_number": applicant.contact_number,
                "location": applicant.current_address,
                "application_created_at": applicant.application_created_at,
                "status": applicant.status if applicant.status else "pending",
                "applicant_tags": applicant_tags,  # Array of tag IDs
                "match_score": match_score if match_score is not None else 0  # Default to 0 if null
            }
            applicants_data.append(applicant_info)
        
        return {
            "job_id": job_id,
            "job_title": job.job_title,
            "total_applicants": len(applicants_data),
            "applicants": applicants_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"DEBUG: Error in get_my_job_applicants: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
