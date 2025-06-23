from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession  # Fixed: removed the extra 'l'
from typing import List

from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyOut
from app.crud import company as crud
from app.core.database import get_db
from app.middleware.auth import get_current_company

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

# Complete company onboarding - update additional details
@router.put("/onboarding")
async def complete_onboarding(
    company_data: CompanyUpdate,
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Complete company onboarding - update additional details"""
    try:
        company_id = company_info["db_user"].company_id
        
        # Update company with onboarding data
        updated_company = await crud.update_company(db, company_id, company_data)
        
        if not updated_company:
            raise HTTPException(status_code=404, detail="Company not found")
        
        return {
            "company": updated_company,
            "message": "Onboarding completed successfully",
            "onboarding_complete": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Check if company needs to complete onboarding
@router.get("/onboarding-status")
async def get_onboarding_status(
    company_info = Depends(get_current_company)
):
    """Check if company needs to complete onboarding"""
    company = company_info["db_user"]
    
    # Check if essential onboarding fields are filled
    needs_onboarding = not all([
        company.location,
        company.description,
        company.company_size
    ])
    
    return {
        "needs_onboarding": needs_onboarding,
        "completed_fields": {
            "location": bool(company.location),
            "description": bool(company.description),
            "company_size": bool(company.company_size),
            "employer_profile_picture": bool(company.employer_profile_picture)
        }
    }

