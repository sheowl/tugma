# crud/jobs.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import text, func, desc, delete
from app.models.jobs import Job, JobTag
from app.models.tags import Tags
from app.models.application import JobApplication
from app.schemas.jobs import JobCreate, JobUpdate
from app.models.company import Company
from app.models.tags import Tags  # Adjust import path as needed
from app.models.jobs import JobTag  # Adjust import path as needed
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

async def get_match_score(db: AsyncSession, applicant_id: int, job_id: int) -> Optional[float]:
    """Get match score from JobMatching table"""
    try:
        from app.models.application import JobMatching
        
        print(f"🔍 DEBUG: Getting match score from JobMatching table for applicant_id: {applicant_id}, job_id: {job_id}")
        
        # Query the JobMatching table for existing match score
        stmt = select(JobMatching.match_score).where(
            JobMatching.applicant_id == applicant_id,
            JobMatching.job_id == job_id
        )
        result = await db.execute(stmt)
        match_score = result.scalar_one_or_none()
        
        if match_score is not None:
            print(f"✅ DEBUG: Found match score in database: {match_score}")
            return float(match_score)
        else:
            print(f"⚠️ DEBUG: No match score found in JobMatching table for applicant {applicant_id}, job {job_id}")
            return 0.0
        
    except Exception as e:
        print(f"❌ DEBUG: Error getting match score from JobMatching table: {e}")
        import traceback
        traceback.print_exc()
        return 0.0

async def get_applicant_tags(db: AsyncSession, applicant_id: int) -> List[int]:
    """Get tags for a specific applicant (returns array of tag IDs)"""
    try:
        # Import the function from tags CRUD instead of duplicating logic
        from app.crud.tags import get_applicant_tag_ids
        return await get_applicant_tag_ids(db, applicant_id)
        
    except Exception as e:
        print(f"❌ DEBUG: Error getting applicant tags for {applicant_id}: {e}")
        import traceback
        traceback.print_exc()
        return []

async def get_all_active_jobs(db: AsyncSession) -> List[Job]:
    """Get all jobs (since we don't have active/inactive status yet)"""
    try:
        result = await db.execute(select(Job))
        jobs = result.scalars().all()
        print(f"🔍 CRUD: Found {len(jobs)} total jobs")
        return list(jobs)
    except Exception as e:
        print(f"❌ CRUD ERROR in get_all_active_jobs: {e}")
        return []

async def get_job_company_info(db: AsyncSession, job_id: int):
    """Get company information for a specific job"""
    try:        
        # Get the job first
        job_result = await db.execute(select(Job).where(Job.job_id == job_id))
        job = job_result.scalar_one_or_none()
        
        if not job:
            return None
            
        # Get company info
        company_result = await db.execute(select(Company).where(Company.company_id == job.company_id))
        company = company_result.scalar_one_or_none()
        
        return company
        
    except Exception as e:
        print(f"❌ Error getting job company info: {e}")
        import traceback
        traceback.print_exc()
        return None

# Also, fix your get_job_tags function to return tag objects, not just IDs
async def get_job_tags_with_names(db: AsyncSession, job_id: int):
    """Get all tags with names for a specific job"""
    try:
        
        result = await db.execute(
            select(Tags)
            .join(JobTag, Tags.tag_id == JobTag.tag_id)
            .where(JobTag.job_id == job_id)
        )
        
        tags = result.scalars().all()
        return list(tags)
        
    except Exception as e:
        print(f"❌ Error getting job tags with names: {e}")
        import traceback
        traceback.print_exc()
        return []

