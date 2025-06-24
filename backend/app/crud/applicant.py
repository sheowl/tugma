# crud/applicant.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import Optional, List
from app.core.auth import get_password_hash
from app.models.applicant import Applicant, ApplicantWorkExperience, ApplicantCertificate
from app.schemas.applicant import (
    ApplicantCreate,
    ApplicantUpdate,
    ApplicantWorkExperienceCreate,
    ApplicantCertificateCreate
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
    result = await db.execute(select(Applicant).where(Applicant.email == email))
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


async def delete_applicant(db: AsyncSession, applicant_id: int) -> None:
    result = await db.execute(select(Applicant).where(Applicant.applicant_id == applicant_id))
    applicant = result.scalars().first()
    if applicant:
        await db.delete(applicant)
        await db.commit()


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
    cert = ApplicantCertificate(applicant_id=applicant_id, **certificate.dict())
    db.add(cert)
    await db.commit()
    await db.refresh(cert)
    return cert

async def get_applicant_certificates(db: AsyncSession, applicant_id: int):
    result = await db.execute(select(ApplicantCertificate).where(ApplicantCertificate.applicant_id == applicant_id))
    return result.scalars().all()

