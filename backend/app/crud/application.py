# crud/application.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime

from app.models.application import JobApplication, JobMatching
from app.schemas.application import JobApplicationCreate, JobApplicationUpdate
from app.models.jobs import Job

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
    return application

# Get applications for a specific applicant
async def get_applications_by_applicant(db: AsyncSession, applicant_id: int) -> List[JobApplication]:
    result = await db.execute(
        select(JobApplication).where(JobApplication.applicant_id == applicant_id)
    )
    return list(result.scalars().all())

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

# Create or update a job match score
async def upsert_job_match(
    db: AsyncSession, applicant_id: int, job_id: int, match_score: float
) -> JobMatching:
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

