# crud/jobs.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import text, func, desc, delete
from app.models.jobs import Job, JobTag
from app.models.tags import Tags
from app.schemas.jobs import JobCreate, JobUpdate, JobTagCreate
from typing import List, Optional

async def create_job(db: AsyncSession, job_in: JobCreate) -> Job:
    # Create job without tags first
    job_data = job_in.model_dump(exclude={'job_tags'})
    new_job = Job(**job_data)
    db.add(new_job)
    await db.flush()  # Flush to get the job_id
    
    # Add job tags if provided (automatically set is_required=True)
    if job_in.job_tags:
        for tag_id in job_in.job_tags:  # Changed: now just tag IDs
            job_tag = JobTag(
                job_id=new_job.job_id,
                tag_id=tag_id,
                is_required=True  # Always set to True
            )
            db.add(job_tag)
    
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

async def get_job_tags(db: AsyncSession, job_id: int) -> List[dict]:
    """Get all tags for a specific job"""
    result = await db.execute(
        select(JobTag.tag_id, JobTag.is_required, Tags.tag_name)
        .join(Tags, JobTag.tag_id == Tags.tag_id)
        .where(JobTag.job_id == job_id)
    )
    
    tags = []
    for row in result.fetchall():
        tags.append({
            "tag_id": row.tag_id,
            "is_required": row.is_required,
            "tag_name": row.tag_name  # Optional: include tag name for reference
        })
    
    return tags

async def update_job_tags(db: AsyncSession, job_id: int, tag_ids: List[int]) -> bool:
    """Update job tags by replacing all existing tags with new ones (all set to required=True)"""
    try:
        # Delete existing job tags
        await db.execute(delete(JobTag).where(JobTag.job_id == job_id))
        
        # Add new job tags (all set to required=True)
        for tag_id in tag_ids:
            job_tag = JobTag(
                job_id=job_id,
                tag_id=tag_id,
                is_required=True  # Always set to True
            )
            db.add(job_tag)
        
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e

async def delete_job_tags(db: AsyncSession, job_id: int) -> bool:
    """Delete all tags for a specific job"""
    try:
        await db.execute(delete(JobTag).where(JobTag.job_id == job_id))
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        return False

async def update_job(db: AsyncSession, job_id: int, job_update: JobUpdate) -> Optional[Job]:
    result = await db.execute(select(Job).where(Job.job_id == job_id))
    job = result.scalars().first()
    
    if job:
        # Update job fields (excluding job_tags)
        job_data = job_update.model_dump(exclude_unset=True, exclude={'job_tags'})
        for field, value in job_data.items():
            setattr(job, field, value)
        
        # Update job tags if provided (convert tag IDs to required tags)
        if job_update.job_tags is not None:
            await update_job_tags(db, job_id, job_update.job_tags)
        
        await db.commit()
        await db.refresh(job)
    
    return job

async def delete_job(db: AsyncSession, job_id: int) -> bool:
    result = await db.execute(select(Job).where(Job.job_id == job_id))
    job = result.scalars().first()
    
    if job:
        # Delete job tags first (due to foreign key constraint)
        await delete_job_tags(db, job_id)
        
        # Delete the job
        await db.delete(job)
        await db.commit()
        return True
    return False

async def get_applicant_count_by_job(db: AsyncSession, job_id: int) -> int:
    """Get the count of applicants for a specific job"""
    result = await db.execute(
        text("SELECT COUNT(*) FROM Job_Application WHERE job_id = :job_id"),
        {"job_id": job_id}
    )
    count = result.scalar()
    return count if count is not None else 0

async def get_applicants_by_job(db: AsyncSession, job_id: int):
    """Get all applicants for a specific job with their application details"""
    result = await db.execute(
        text("""
        SELECT 
            ja.applicant_id,
            ja.job_id,
            ja.status,
            ja.created_at as application_created_at,
            a.first_name,
            a.last_name,
            a.email,
            a.phone_number,
            a.location
        FROM Job_Application ja
        JOIN Applicant a ON ja.applicant_id = a.applicant_id
        WHERE ja.job_id = :job_id
        ORDER BY ja.created_at DESC
        """),
        {"job_id": job_id}
    )
    
    return result.fetchall()

