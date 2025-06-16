# crud/job.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
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

