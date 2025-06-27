# crud/company.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, func, desc
from app.models.company import Company
from app.models.jobs import Job
from app.models.application import JobApplication  # Make sure this exists
from app.models.applicant import Applicant        # Make sure this exists
from app.schemas.company import CompanyCreate, CompanyUpdate
from app.core.auth import get_password_hash
from typing import Optional, Dict, List
from datetime import datetime, timedelta, timezone  # Add timezone import

async def create_company(db: AsyncSession, company_in: CompanyCreate) -> Company:
    new_company = Company(
        company_email=company_in.company_email,
        password=get_password_hash(company_in.password),
        company_name=company_in.company_name.strip(),
        location=company_in.location,
        description=company_in.description,
        company_size=company_in.company_size,
        employer_profile_picture=company_in.employer_profile_picture,
        contact_links=company_in.contact_links or {}
    )
    db.add(new_company)
    await db.commit()
    await db.refresh(new_company)
    return new_company

async def get_company_by_id(db: AsyncSession, company_id: int) -> Optional[Company]:
    result = await db.execute(select(Company).where(Company.company_id == company_id))
    return result.scalars().first()

async def get_company_by_name(db: AsyncSession, name: str) -> Optional[Company]:
    result = await db.execute(select(Company).where(Company.company_name == name))
    return result.scalars().first()

async def update_company(db: AsyncSession, company_id: int, company_update: CompanyUpdate) -> Optional[Company]:
    result = await db.execute(select(Company).where(Company.company_id == company_id))
    company = result.scalars().first()
    if company:
        for field, value in company_update.model_dump(exclude_unset=True).items():
            setattr(company, field, value)
        await db.commit()
        await db.refresh(company)
    return company

async def delete_company(db: AsyncSession, company_id: int) -> bool:
    result = await db.execute(select(Company).where(Company.company_id == company_id))
    company = result.scalars().first()
    if company:
        await db.delete(company)
        await db.commit()
        return True
    return False

async def get_company_by_email(db: AsyncSession, email: str) -> Optional[Company]:
    result = await db.execute(select(Company).where(Company.company_email == email))
    return result.scalars().first()

async def get_company_dashboard_stats(db: AsyncSession, company_id: int) -> Dict:
    """Get dashboard statistics for a company"""
    
    # Get active jobs count
    active_jobs_result = await db.execute(
        select(func.count(Job.job_id)).where(Job.company_id == company_id)
    )
    active_jobs = active_jobs_result.scalar() or 0
    
    # Get total applications count for all company jobs
    total_applications_result = await db.execute(
        select(func.count(JobApplication.applicant_id))
        .select_from(JobApplication)
        .join(Job, JobApplication.job_id == Job.job_id)
        .where(Job.company_id == company_id)
    )
    total_applications = total_applications_result.scalar() or 0
    
    # Get pending reviews count (applications with status 'pending' or null)
    pending_reviews_result = await db.execute(
        select(func.count(JobApplication.applicant_id))
        .select_from(JobApplication)
        .join(Job, JobApplication.job_id == Job.job_id)
        .where(
            Job.company_id == company_id,
            (JobApplication.status == 'pending') | (JobApplication.status.is_(None))
        )
    )
    pending_reviews = pending_reviews_result.scalar() or 0
    
    return {
        "active_jobs": active_jobs,
        "total_applications": total_applications,
        "pending_reviews": pending_reviews
    }

async def get_recent_applicants(db: AsyncSession, company_id: int) -> List[Dict]:
    """Get recent applicants for a company with their application details"""
    
    print(f"🔍 DEBUG: Getting recent applicants for company_id: {company_id}")
    
    try:
        # Fixed query with correct field name
        result = await db.execute(
            select(
                JobApplication.applicant_id,
                JobApplication.job_id,
                JobApplication.status,
                JobApplication.created_at,
                Job.job_title,
                Applicant.first_name,
                Applicant.last_name,
                Applicant.applicant_profile_picture
            )
            .select_from(JobApplication)
            .join(Job, JobApplication.job_id == Job.job_id)
            .join(Applicant, JobApplication.applicant_id == Applicant.applicant_id)
            .where(Job.company_id == company_id)
            .order_by(desc(JobApplication.created_at))
        )
        
        applications = result.fetchall()
        print(f"🔍 DEBUG: Found {len(applications)} applications")
        
        if not applications:
            print("🔍 DEBUG: No applications found")
            return []
        
        recent_applicants = []
        for app in applications:
            print(f"🔍 DEBUG: Processing application: {app}")
            
            # Fix timezone issue - use timezone-aware datetime
            now = datetime.now(timezone.utc)
            time_diff = now - app.created_at
            
            if time_diff.days > 0:
                time_ago = f"{time_diff.days} day{'s' if time_diff.days > 1 else ''} ago"
            elif time_diff.seconds > 3600:
                hours = time_diff.seconds // 3600
                time_ago = f"{hours} hour{'s' if hours > 1 else ''} ago"
            else:
                minutes = max(1, time_diff.seconds // 60)
                time_ago = f"{minutes} minute{'s' if minutes > 1 else ''} ago"
            
            # Mock match percentage for now
            import random
            match_percentage = random.randint(65, 95)
            
            recent_applicants.append({
                "id": app.applicant_id,
                "name": f"{app.first_name} {app.last_name}",
                "position": app.job_title,
                "time_ago": time_ago,
                "match_percentage": match_percentage,
                "status": app.status or "new",
                "applied_at": app.created_at.isoformat(),
                "profile_picture": app.applicant_profile_picture
            })
        
        print(f"🔍 DEBUG: Returning {len(recent_applicants)} recent applicants")
        return recent_applicants
        
    except Exception as e:
        print(f"❌ DEBUG: Error in get_recent_applicants: {e}")
        import traceback
        traceback.print_exc()
        raise e

