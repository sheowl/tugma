# crud/company.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from app.models.company import Company
from app.schemas.company import CompanyCreate, CompanyUpdate
from app.core.auth import get_password_hash
from typing import Optional

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

