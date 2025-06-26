# crud/jobs.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import text, func, desc, delete
from app.models.jobs import Job, JobTag
from app.models.tags import Tags
from app.models.application import JobApplication
from app.schemas.jobs import JobCreate, JobUpdate
from typing import List, Optional

async def create_job(db: AsyncSession, job_in: JobCreate) -> Job:
    # Create job without tags first
    job_data = job_in.model_dump(exclude={'job_tags'})
    new_job = Job(**job_data)
    db.add(new_job)
    await db.flush()  # Flush to get the job_id
    
    # Add job tags if provided
    if job_in.job_tags:
        for tag_id in job_in.job_tags:
            job_tag = JobTag(
                job_id=new_job.job_id,
                tag_id=tag_id,
                is_required=True  # Keep in model but always true
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

async def get_job_tags(db: AsyncSession, job_id: int) -> List[int]:
    """Get all tag IDs for a specific job"""
    result = await db.execute(
        select(JobTag.tag_id)
        .where(JobTag.job_id == job_id)
    )
    
    return list(result.scalars().all())

async def update_job_tags(db: AsyncSession, job_id: int, tag_ids: List[int]) -> bool:
    """Update job tags by replacing all existing tags with new ones"""
    try:
        # Delete existing job tags
        await db.execute(delete(JobTag).where(JobTag.job_id == job_id))
        
        # Add new job tags
        for tag_id in tag_ids:
            job_tag = JobTag(
                job_id=job_id,
                tag_id=tag_id,
                is_required=True  # Keep in model but always true
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
    """Update a job and its associated tags"""
    try:
        # Get the existing job first
        stmt = select(Job).where(Job.job_id == job_id)
        result = await db.execute(stmt)
        job = result.scalar_one_or_none()
        
        if not job:
            return None
        
        # Prepare update data excluding immutable fields
        update_data = job_update.model_dump(exclude_unset=True, exclude={'date_added', 'created_at'})
        
        # Extract job_tags from update data if present
        job_tags = update_data.pop('job_tags', None)
        
        print(f"🔍 DEBUG: Updating job {job_id} with data: {update_data}")
        print(f"🔍 DEBUG: Job tags to update: {job_tags}")
        
        # Update job fields (excluding date_added and created_at)
        for field, value in update_data.items():
            if hasattr(job, field):
                setattr(job, field, value)
        
        # Handle job tags update if provided
        if job_tags is not None:
            print(f"🔍 DEBUG: Updating job tags for job {job_id}")
            
            # Delete existing job tags
            delete_stmt = delete(JobTag).where(JobTag.job_id == job_id)
            await db.execute(delete_stmt)
            
            # Add new job tags (all set to required=True by default)
            for tag_id in job_tags:
                job_tag = JobTag(
                    job_id=job_id,
                    tag_id=tag_id,
                    is_required=True  # All tags are required by default
                )
                db.add(job_tag)
        
        await db.commit()
        await db.refresh(job)
        
        print(f"🔍 DEBUG: Job {job_id} updated successfully")
        return job
        
    except Exception as e:
        print(f"❌ DEBUG: Error updating job: {e}")
        await db.rollback()
        raise e

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
    """Get the count of applicants for a specific job using ORM"""
    result = await db.execute(
        select(func.count(JobApplication.applicant_id))
        .where(JobApplication.job_id == job_id)
    )
    count = result.scalar()
    return count if count is not None else 0

async def get_applicants_by_job(db: AsyncSession, job_id: int):
    """Get all applicants for a specific job with their application details using ORM"""
    from app.models.applicant import Applicant
    
    result = await db.execute(
        select(
            JobApplication.applicant_id,
            JobApplication.job_id,
            JobApplication.status,
            JobApplication.created_at.label('application_created_at'),
            Applicant.first_name,
            Applicant.last_name,
            Applicant.applicant_email,
            Applicant.contact_number,
            Applicant.current_address
        )
        .join(Applicant, JobApplication.applicant_id == Applicant.applicant_id)
        .where(JobApplication.job_id == job_id)
        .order_by(desc(JobApplication.created_at))
    )
    
    return result.fetchall()

# Add these functions to your CRUD file

async def get_applicant_tags(db: AsyncSession, applicant_id: int) -> List[int]:
    """Get tags for a specific applicant (returns array of tag IDs)"""
    try:
        from app.models.applicants import ApplicantTag  # Adjust import based on your model location
        
        stmt = select(ApplicantTag.tag_id).where(ApplicantTag.applicant_id == applicant_id)
        result = await db.execute(stmt)
        tag_ids = result.scalars().all()
        
        print(f"🔍 DEBUG: Found {len(tag_ids)} tags for applicant {applicant_id}")
        return list(tag_ids)
        
    except Exception as e:
        print(f"❌ DEBUG: Error getting applicant tags: {e}")
        return []

async def get_match_score(db: AsyncSession, applicant_id: int, job_id: int) -> Optional[float]:
    """Get match score between applicant and job"""
    try:
        # Check if you have a match_scores table
        from app.models.applicants import MatchScore  # Adjust import based on your model
        
        stmt = select(MatchScore.score).where(
            MatchScore.applicant_id == applicant_id,
            MatchScore.job_id == job_id
        )
        result = await db.execute(stmt)
        score = result.scalar_one_or_none()
        
        print(f"🔍 DEBUG: Match score for applicant {applicant_id} and job {job_id}: {score}")
        return score
        
    except Exception as e:
        print(f"❌ DEBUG: Error getting match score: {e}")
        # If no match_scores table exists, you could calculate on the fly or return 0
        return None
