# crud/job.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import text, func, desc  # Add func and desc imports
from app.models.jobs import Job
from app.schemas.jobs import JobCreate, JobUpdate
from typing import List, Optional

async def create_job(db: AsyncSession, job_in: JobCreate) -> Job:
    new_job = Job(**job_in.model_dump())
    db.add(new_job)
    await db.commit()
    await db.refresh(new_job)
    return new_job

async def get_all_jobs(db: AsyncSession) -> List[Job]:
    result = await db.execute(select(Job))
    return list(result.scalars().all())

async def get_job_by_id(db: AsyncSession, job_id: int) -> Optional[Job]:
    result = await db.execute(select(Job).where(Job.job_id == job_id))
    return result.scalars().first()

async def get_jobs_by_company(db: AsyncSession, company_id: int) -> List[Job]:
    result = await db.execute(select(Job).where(Job.company_id == company_id))
    return list(result.scalars().all())
    
async def update_job(db: AsyncSession, job_id: int, job_update: JobUpdate) -> Optional[Job]:
    result = await db.execute(select(Job).where(Job.job_id == job_id))
    job = result.scalars().first()
    if job:
        for field, value in job_update.model_dump(exclude_unset=True).items():
            setattr(job, field, value)
        await db.commit()
        await db.refresh(job)
    return job

async def delete_job(db: AsyncSession, job_id: int) -> bool:
    result = await db.execute(select(Job).where(Job.job_id == job_id))
    job = result.scalars().first()
    
    if job:
        await db.delete(job)
        await db.commit()
        return True
    return False

async def get_applicant_count_by_job(db: AsyncSession, job_id: int) -> int:
    """Get the count of applicants for a specific job"""
    try:
        # Use the correct table name and ORM approach like in company.py
        from app.models.application import JobApplication
        
        result = await db.execute(
            select(func.count(JobApplication.applicant_id)).where(
                JobApplication.job_id == job_id
            )
        )
        count = result.scalar() or 0
        print(f"🔍 DEBUG: Found {count} applicants for job {job_id}")
        return count
        
    except Exception as e:
        print(f"❌ DEBUG: Error getting applicant count for job {job_id}: {e}")
        import traceback
        traceback.print_exc()
        return 0

async def get_applicants_by_job(db: AsyncSession, job_id: int):
    """Get all applicants for a specific job with their details"""
    try:
        # Use the correct table names and ORM approach
        from app.models.application import JobApplication
        from app.models.applicant import Applicant
        
        result = await db.execute(
            select(
                JobApplication.applicant_id,
                JobApplication.job_id,
                JobApplication.created_at.label('application_created_at'),
                JobApplication.status,
                Applicant.first_name,
                Applicant.last_name,
                Applicant.applicant_email.label('email'),
                Applicant.contact_number.label('phone_number'),
                Applicant.current_address.label('location')
            )
            .select_from(JobApplication)
            .join(Applicant, JobApplication.applicant_id == Applicant.applicant_id)
            .where(JobApplication.job_id == job_id)
            .order_by(desc(JobApplication.created_at))
        )
        
        applicants = result.fetchall()
        print(f"🔍 DEBUG: Found {len(applicants)} applicants for job {job_id}")
        return applicants
        
    except Exception as e:
        print(f"❌ DEBUG: Error getting applicants for job {job_id}: {e}")
        import traceback
        traceback.print_exc()
        return []

