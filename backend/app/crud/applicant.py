# crud/applicant.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy import delete
from typing import Optional, List
from app.core.auth import get_password_hash
from app.models.applicant import Applicant, ApplicantWorkExperience, ApplicantCertificate, ApplicantProficiency, ApplicantTag
from app.schemas.applicant import (
    ApplicantCreate,
    ApplicantUpdate,
    ApplicantWorkExperienceCreate,
    ApplicantCertificateCreate,
    ApplicantProficiencyCreate
)
from app.models.base import Base


def clean_string(s: Optional[str]) -> Optional[str]:
    return s.strip() if s else s

async def create_applicant(db: AsyncSession, applicant_in: ApplicantCreate) -> Applicant:
    new_applicant = Applicant(
        applicant_email=applicant_in.email,
        first_name=clean_string(applicant_in.first_name),
        last_name=clean_string(applicant_in.last_name),
        password=get_password_hash(applicant_in.password),
        current_address=applicant_in.current_address,
        contact_number=applicant_in.contact_number,
        telephone_number=applicant_in.telephone_number,
        university=applicant_in.university,
        degree=applicant_in.degree,
        year_graduated=applicant_in.year_graduated,
        field=applicant_in.field,
        preferred_worksetting=applicant_in.preferred_worksetting,
        preferred_worktype=applicant_in.preferred_worktype,
        applicant_profile_picture=applicant_in.applicant_profile_picture,
        social_links=applicant_in.social_links
    )
    db.add(new_applicant)
    try:
        await db.commit()
        await db.refresh(new_applicant)
        return new_applicant
    except IntegrityError:
        await db.rollback()
        raise


async def get_applicant_by_email(db: AsyncSession, email: str) -> Optional[Applicant]:
    result = await db.execute(select(Applicant).where(Applicant.applicant_email == email))
    return result.scalars().first()


async def get_applicant_by_id(db: AsyncSession, applicant_id: int) -> Optional[Applicant]:
    result = await db.execute(select(Applicant).where(Applicant.applicant_id == applicant_id))
    return result.scalars().first()


async def update_applicant(db: AsyncSession, db_applicant: Applicant, updates: ApplicantUpdate) -> Applicant:
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(db_applicant, field, value)
    await db.commit()
    await db.refresh(db_applicant)
    return db_applicant


async def delete_applicant(db: AsyncSession, applicant_id: int):
    # Import all the models you need to delete
    from app.models.application import JobApplication, JobMatching
    from app.models.notification import Notification
    from app.models.interview import InterviewDetails
    
    # 1. Delete all work experiences (already handled by CASCADE)
    work_exp_stmt = delete(ApplicantWorkExperience).where(
        ApplicantWorkExperience.applicant_id == applicant_id
    )
    await db.execute(work_exp_stmt)
    
    # 2. Delete all certificates
    cert_stmt = delete(ApplicantCertificate).where(
        ApplicantCertificate.applicant_id == applicant_id
    )
    await db.execute(cert_stmt)
    
    # 3. Delete all job applications
    app_stmt = delete(JobApplication).where(
        JobApplication.applicant_id == applicant_id
    )
    await db.execute(app_stmt)
    
    # 4. Delete all job matching records
    match_stmt = delete(JobMatching).where(
        JobMatching.applicant_id == applicant_id
    )
    await db.execute(match_stmt)
    
    # 5. Delete all notifications
    notif_stmt = delete(Notification).where(
        Notification.recipient_applicant_id == applicant_id
    )
    await db.execute(notif_stmt)
    
    # 6. Delete all interview records
    interview_stmt = delete(InterviewDetails).where(
        InterviewDetails.applicant_id == applicant_id
    )
    await db.execute(interview_stmt)
    
    # 7. Delete any applicant tags
    from app.models.applicant import ApplicantTag
    tag_stmt = delete(ApplicantTag).where(
        ApplicantTag.applicant_id == applicant_id
    )
    await db.execute(tag_stmt)
    
    # 8. Delete applicant proficiency records
    prof_stmt = delete(ApplicantProficiency).where(
        ApplicantProficiency.applicant_id == applicant_id
    )
    await db.execute(prof_stmt)
    
    # 9. Finally, delete the applicant
    stmt = delete(Applicant).where(Applicant.applicant_id == applicant_id)
    result = await db.execute(stmt)
    await db.commit()
    
    return result.rowcount > 0


async def get_all_applicants(db: AsyncSession) -> List[Applicant]:
    result = await db.execute(select(Applicant))
    return list(result.scalars().all())


# --- Work Experience ---
async def add_work_experience(db: AsyncSession, applicant_id: int, experience: ApplicantWorkExperienceCreate):
    exp = ApplicantWorkExperience(applicant_id=applicant_id, **experience.dict())
    db.add(exp)
    await db.commit()
    await db.refresh(exp)
    return exp

async def get_applicant_experience(db: AsyncSession, applicant_id: int):
    result = await db.execute(select(ApplicantWorkExperience).where(ApplicantWorkExperience.applicant_id == applicant_id))
    return result.scalars().all()


# --- Certificates ---
async def add_certificate(db: AsyncSession, applicant_id: int, certificate: ApplicantCertificateCreate):
    """Add a certificate for an applicant"""
    print(f"CRUD: Adding certificate for applicant {applicant_id}")
    print(f"CRUD: Certificate data: {certificate}")
    
    # FIXED: Include certificate_file_url
    db_certificate = ApplicantCertificate(
        applicant_id=applicant_id,
        certificate_name=certificate.certificate_name,
        certificate_description=certificate.certificate_description,
        certificate_file_url=certificate.certificate_file_url  # ADD THIS FIELD
    )
    
    db.add(db_certificate)
    
    try:
        await db.commit()
        await db.refresh(db_certificate)
        print(f"✅ CRUD: Certificate saved successfully")
        return db_certificate
    except Exception as e:
        print(f"❌ CRUD: Error saving certificate: {e}")
        await db.rollback()
        raise e

async def get_applicant_certificates(db: AsyncSession, applicant_id: int):
    result = await db.execute(select(ApplicantCertificate).where(ApplicantCertificate.applicant_id == applicant_id))
    return result.scalars().all()


# --- Proficiency ---
async def create_proficiency(db: AsyncSession, applicant_id: int, proficiency: ApplicantProficiencyCreate):
    prof = ApplicantProficiency(
        applicant_id=applicant_id,
        category_id=proficiency.category_id,
        proficiency=proficiency.proficiency
    )
    db.add(prof)
    await db.commit()
    await db.refresh(prof)
    return prof

async def get_applicant_proficiency(db: AsyncSession, applicant_id: int):
    result = await db.execute(select(ApplicantProficiency).where(ApplicantProficiency.applicant_id == applicant_id))
    return result.scalars().all()

async def update_proficiency(
    db: AsyncSession,
    applicant_id: int,
    category_id: int,
    new_proficiency: int
):
    from app.models.applicant import ApplicantProficiency
    result = await db.execute(
        select(ApplicantProficiency).where(
            ApplicantProficiency.applicant_id == applicant_id,
            ApplicantProficiency.category_id == category_id
        )
    )
    prof = result.scalars().first()
    if prof:
        prof.proficiency = new_proficiency
        await db.commit()
        await db.refresh(prof)
        return prof
    return None

async def get_applicant_tags(db: AsyncSession, applicant_id: int) -> List[dict]:
    from app.crud.tags import get_applicant_tags as tags_getter
    return await tags_getter(db, applicant_id)

