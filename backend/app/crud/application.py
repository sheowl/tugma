# crud/application.py
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime

from app.models.application import JobApplication, JobMatching
from app.schemas.application import JobApplicationCreate, JobApplicationUpdate, JobMatchingCreate, JobMatchingUpdate
from app.models.jobs import Job
from app.models.company import Company
from app.models.tags import TagCategory
from app.services.matching_service import MatchingService

# Submit a new job application
async def create_job_application(db: AsyncSession, app_in: JobApplicationCreate) -> JobApplication:
    # Convert the data and handle created_at manually
    app_data = app_in.model_dump(exclude={'created_at'})  # Exclude created_at from the input
    
    application = JobApplication(
        applicant_id=app_data.get('applicant_id'),
        job_id=app_data.get('job_id'),
        status=app_data.get('status'),
        remarks=app_data.get('remarks'),
        created_at=datetime.utcnow()  # Use timezone-naive datetime
    )
    
    db.add(application)
    await db.commit()
    await db.refresh(application)

        # --- ADD THIS BLOCK ---
    # Calculate match score
    match_details = await MatchingService.calculate_job_match_score_with_details(
        db, application.applicant_id, application.job_id
    )
    match_score = match_details.get("match_score", 0)

    # Upsert into Job_Matching
    await upsert_job_match(db, application.applicant_id, application.job_id, match_score)
    # --- END BLOCK ---

    return application

    return application

# Get applications for a specific applicant
async def get_applications_by_applicant(db: AsyncSession, applicant_id: int):
    result = await db.execute(
        select(JobApplication, Job, Company, TagCategory, JobMatching.match_score)
        .join(Job, JobApplication.job_id == Job.job_id)
        .join(Company, Job.company_id == Company.company_id)
        .outerjoin(JobMatching, (JobMatching.applicant_id == JobApplication.applicant_id) & (JobMatching.job_id == JobApplication.job_id))
        .join(TagCategory, Job.required_category_id == TagCategory.category_id)
        .where(JobApplication.applicant_id == applicant_id)
    )
    rows = result.all()
    applications = []
    for app, job, company, category, match_score in rows:
        applications.append({
            "applicant_id": app.applicant_id,
            "job_id": app.job_id,
            "status": app.status,
            "remarks": app.remarks,
            "created_at": app.created_at,
            "jobTitle": job.job_title,
            "companyName": company.company_name,
            "location": company.location,
            "description": job.description,
            "salaryRangeLow": job.salary_min,
            "salaryRangeHigh": job.salary_max,
            "salaryFrequency": "Monthly",  # Add this field
            "setting": job.setting,
            "jobType": job.work_type,
            "workSetup": job.setting,      # Add this for consistency
            "employmentType": job.work_type, # Add this for consistency
            "matchScore": match_score or 0,              # Add a default match score
            "tags": [],                    # Add empty tags array
            "requiredCategory": category.category_name,
            "requiredProficiency": job.required_proficiency,
            # Add more fields as needed
        })
    return applications

# Get a specific application by applicant and job
async def get_application(db: AsyncSession, applicant_id: int, job_id: int) -> Optional[JobApplication]:
    result = await db.execute(
        select(JobApplication).where(
            JobApplication.applicant_id == applicant_id,
            JobApplication.job_id == job_id
        )
    )
    return result.scalar_one_or_none()

# Update application status
async def update_application_status(
    db: AsyncSession,
    applicant_id: int,
    job_id: int,
    update_data: JobApplicationUpdate
) -> Optional[JobApplication]:
    application = await get_application(db, applicant_id, job_id)
    if not application:
        return None

    # Exclude created_at from updates since it shouldn't be modified
    for field, value in update_data.model_dump(exclude_unset=True, exclude={'created_at'}).items():
        if field == 'created_at':
            continue  # Skip created_at field
        setattr(application, field, value)

    await db.commit()
    await db.refresh(application)
    return application

# ====================== JOB MATCHING CRUD OPERATIONS ======================

# Create a new job match
async def create_job_match(db: AsyncSession, match_in: JobMatchingCreate) -> JobMatching:
    """Create a new job match entry"""
    match = JobMatching(**match_in.model_dump())
    db.add(match)
    await db.commit()
    await db.refresh(match)
    return match

# Get all job matches
async def get_all_job_matches(db: AsyncSession) -> List[JobMatching]:
    """Get all job matches"""
    result = await db.execute(select(JobMatching))
    return list(result.scalars().all())

# Get job matches for a specific applicant
async def get_job_matches_by_applicant(db: AsyncSession, applicant_id: int) -> List[JobMatching]:
    """Get all job matches for a specific applicant"""
    result = await db.execute(
        select(JobMatching).where(JobMatching.applicant_id == applicant_id)
    )
    return list(result.scalars().all())

# Get job matches for a specific job
async def get_job_matches_by_job(db: AsyncSession, job_id: int) -> List[JobMatching]:
    """Get all job matches for a specific job"""
    result = await db.execute(
        select(JobMatching).where(JobMatching.job_id == job_id)
    )
    return list(result.scalars().all())

# Get a specific job match
async def get_job_match(db: AsyncSession, applicant_id: int, job_id: int) -> Optional[JobMatching]:
    """Get a specific job match by applicant_id and job_id"""
    result = await db.execute(
        select(JobMatching).where(
            JobMatching.applicant_id == applicant_id,
            JobMatching.job_id == job_id
        )
    )
    return result.scalar_one_or_none()

# Update a job match
async def update_job_match(
    db: AsyncSession,
    applicant_id: int,
    job_id: int,
    update_data: JobMatchingUpdate
) -> Optional[JobMatching]:
    """Update a job match entry"""
    match = await get_job_match(db, applicant_id, job_id)
    if not match:
        return None

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(match, field, value)

    await db.commit()
    await db.refresh(match)
    return match

# Delete a job match
async def delete_job_match(db: AsyncSession, applicant_id: int, job_id: int) -> bool:
    """Delete a job match entry"""
    match = await get_job_match(db, applicant_id, job_id)
    if not match:
        return False
    
    await db.delete(match)
    await db.commit()
    return True

# Create or update a job match score (upsert)
async def upsert_job_match(
    db: AsyncSession, applicant_id: int, job_id: int, match_score: float
) -> JobMatching:
    """Create or update a job match entry"""
    result = await db.execute(
        select(JobMatching).where(
            JobMatching.applicant_id == applicant_id,
            JobMatching.job_id == job_id
        )
    )
    match = result.scalar_one_or_none()

    if match:
        match.match_score = match_score
    else:
        match = JobMatching(applicant_id=applicant_id, job_id=job_id, match_score=match_score)
        db.add(match)

    await db.commit()
    await db.refresh(match)
    return match

# Get top matches for an applicant (sorted by match_score)
async def get_top_matches_for_applicant(db: AsyncSession, applicant_id: int, limit: int = 10) -> List[JobMatching]:
    """Get top job matches for an applicant sorted by match score"""
    result = await db.execute(
        select(JobMatching)
        .where(JobMatching.applicant_id == applicant_id)
        .order_by(JobMatching.match_score.desc())
        .limit(limit)
    )
    return list(result.scalars().all())

# Get top matches for a job (sorted by match_score)
async def get_top_matches_for_job(db: AsyncSession, job_id: int, limit: int = 10) -> List[JobMatching]:
    """Get top applicant matches for a job sorted by match score"""
    result = await db.execute(
        select(JobMatching)
        .where(JobMatching.job_id == job_id)
        .order_by(JobMatching.match_score.desc())
        .limit(limit)
    )
    return list(result.scalars().all())

