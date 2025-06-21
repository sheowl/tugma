from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyOut
from app.crud import company as crud
from app.core.database import get_db

router = APIRouter()

# Create a new company (employer)
@router.post("/", response_model=CompanyOut)
async def create_company(company: CompanyCreate, db: AsyncSession = Depends(get_db)):
    try:
        result = await crud.create_company(db, company)
        return result
    except Exception as e:
        print(f"Error creating company: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Get a company by ID
@router.get("/{company_id}", response_model=CompanyOut)
async def get_company(company_id: int, db: AsyncSession = Depends(get_db)):
    company = await crud.get_company_by_id(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

# Update company profile
@router.put("/{company_id}", response_model=CompanyOut)
async def update_company(
    company_id: int,
    updates: CompanyUpdate,
    db: AsyncSession = Depends(get_db)
):
    updated = await crud.update_company(db, company_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail="Company not found")
    return updated

# Delete company profile (optional)
@router.delete("/{company_id}")
async def delete_company(company_id: int, db: AsyncSession = Depends(get_db)):
    success = await crud.delete_company(db, company_id)
    if not success:
        raise HTTPException(status_code=404, detail="Company not found")
    return {"detail": "Company deleted successfully"}

