from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyOut, CompanyOnboardingUpdate
from app.crud import company as crud
from app.core.database import get_db
from app.middleware.auth import get_current_company, get_current_user

router = APIRouter()

# Public route - no authentication needed
@router.post("/", response_model=CompanyOut)
async def create_company(company: CompanyCreate, db: AsyncSession = Depends(get_db)):
    """Public endpoint for creating company (used by auth signup)"""
    try:
        result = await crud.create_company(db, company)
        return result
    except Exception as e:
        print(f"Error creating company: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# SPECIFIC ROUTES FIRST - Put these BEFORE parameterized routes

# Protected route - requires JWT authentication
@router.put("/onboarding")  # ✅ This must come BEFORE /{company_id}
async def complete_onboarding(
    onboarding_data: CompanyOnboardingUpdate,  # ✅ Changed to specific schema
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Complete company onboarding - update location, description, and company_size"""
    try:
        company_id = company_info["db_user"].company_id
        
        # Convert onboarding data to CompanyUpdate format
        update_data = CompanyUpdate(
            location=onboarding_data.location,
            description=onboarding_data.description,
            company_size=onboarding_data.company_size
        )
        
        updated_company = await crud.update_company(db, company_id, update_data)
        
        if not updated_company:
            raise HTTPException(status_code=404, detail="Company not found")
        
        return {
            "company": updated_company,
            "message": "Onboarding completed successfully",
            "onboarding_complete": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/onboarding-status")  # ✅ This must come BEFORE /{company_id}
async def get_onboarding_status(
    company_info = Depends(get_current_company)
):
    """Check if company needs to complete onboarding"""
    company = company_info["db_user"]
    
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

@router.get("/me/profile", response_model=CompanyOut)  # ✅ This must come BEFORE /{company_id}
async def get_my_company_profile(
    company_info = Depends(get_current_company)
):
    """Get authenticated company's own profile"""
    return company_info["db_user"]

@router.put("/me/profile", response_model=CompanyOut)  # ✅ This must come BEFORE /{company_id}
async def update_my_company_profile(
    updates: CompanyUpdate,
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Update authenticated company's own profile"""
    try:
        company_id = company_info["db_user"].company_id
        updated_company = await crud.update_company(db, company_id, updates)
        
        if not updated_company:
            raise HTTPException(status_code=404, detail="Company not found")
        
        return updated_company
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# PARAMETERIZED ROUTES LAST - Put these AFTER specific routes

# Public route - no authentication needed
@router.get("/{company_id}", response_model=CompanyOut)  # ✅ Now this comes after specific routes
async def get_company(company_id: int, db: AsyncSession = Depends(get_db)):
    """Get company profile (public for job seekers to view)"""
    company = await crud.get_company_by_id(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

# Protected route - requires authentication + ownership
@router.put("/{company_id}", response_model=CompanyOut)  # ✅ Now this comes after specific routes
async def update_company(
    company_id: int,
    updates: CompanyUpdate,
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Update company profile (only by authenticated company owner)"""
    authenticated_company_id = company_info["db_user"].company_id
    if authenticated_company_id != company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You can only update your own company profile"
        )
    
    updated = await crud.update_company(db, company_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail="Company not found")
    return updated

@router.delete("/{company_id}")  # ✅ Now this comes after specific routes
async def delete_company(
    company_id: int, 
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Delete company profile (only by authenticated company owner)"""
    authenticated_company_id = company_info["db_user"].company_id
    if authenticated_company_id != company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You can only delete your own company profile"
        )
    
    success = await crud.delete_company(db, company_id)
    if not success:
        raise HTTPException(status_code=404, detail="Company not found")
    return {"detail": "Company deleted successfully"}

@router.get("/dashboard/stats")  # Add this new endpoint
async def get_company_dashboard_stats(
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Get dashboard statistics for authenticated company"""
    try:
        company_id = company_info["db_user"].company_id
        
        # Get stats using CRUD functions
        stats = await crud.get_company_dashboard_stats(db, company_id)
        
        return {
            "active_jobs": stats["active_jobs"],
            "total_applications": stats["total_applications"],
            "pending_reviews": stats["pending_reviews"],
            "company_info": {
                "company_name": company_info["db_user"].company_name,
                "company_size": company_info["db_user"].company_size,
                "location": company_info["db_user"].location
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/dashboard/recent-applicants")  # Remove limit parameter
async def get_recent_applicants(
    company_info = Depends(get_current_company),
    db: AsyncSession = Depends(get_db)
):
    """Get all applicants for authenticated company"""
    try:
        company_id = company_info["db_user"].company_id
        
        # Get all applicants without limit (remove limit parameter)
        all_applicants = await crud.get_recent_applicants(db, company_id)
        
        return {
            "recent_applicants": all_applicants
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

