from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from app.middleware.auth import supabase
from app.core.database import get_db
from app.crud import applicant as applicant_crud
from app.crud import company as company_crud
from app.core.auth import get_password_hash

router = APIRouter()

# === APPLICANT AUTH SCHEMAS ===
class ApplicantSignUp(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str

class ApplicantLogin(BaseModel):
    email: EmailStr
    password: str

# === COMPANY AUTH SCHEMAS ===
class CompanySignUp(BaseModel):
    company_email: EmailStr
    password: str
    company_name: str

class CompanyLogin(BaseModel):
    company_email: EmailStr
    password: str

# === APPLICANT ENDPOINTS ===
@router.post("/applicant/signup")
async def applicant_signup(user_data: ApplicantSignUp, db: AsyncSession = Depends(get_db)):
    """Sign up as an applicant using Supabase Auth + Database"""
    try:
        # Create user in Supabase Auth
        result = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {  # This goes to user_metadata
                    "user_type": "applicant",
                    "first_name": user_data.first_name,
                    "last_name": user_data.last_name
                }
            }
        })
        
        if result.user:
            # Also create in your database for relational data
            from app.schemas.applicant import ApplicantCreate
            applicant_data = ApplicantCreate(
                email=user_data.email,
                password=user_data.password,  # Will be hashed in CRUD
                first_name=user_data.first_name,
                last_name=user_data.last_name
            )
            db_applicant = await applicant_crud.create_applicant(db, applicant_data)
            
            return {
                "user": result.user,
                "session": result.session,
                "applicant_id": db_applicant.applicant_id,
                "message": "Applicant created successfully"
            }
        else:
            raise HTTPException(status_code=400, detail="Failed to create applicant")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/applicant/login")
async def applicant_login(credentials: ApplicantLogin):
    """Login as an applicant"""
    try:
        result = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if result.user and result.user.user_metadata.get("user_type") == "applicant":
            return {
                "user": result.user,
                "session": result.session,
                "access_token": result.session.access_token,
                "refresh_token": result.session.refresh_token,
                "token_type": "bearer",
                "user_type": "applicant"
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid applicant credentials")
            
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

# === COMPANY ENDPOINTS ===
from app.schemas.company import CompanySignup, CompanyCreate

# Remove the old CompanySignUp class and use the new one
@router.post("/company/signup")
async def company_signup(company_data: CompanySignup, db: AsyncSession = Depends(get_db)):
    """Sign up as a company - minimal info required"""
    try:
        # Create user in Supabase Auth
        result = supabase.auth.sign_up({
            "email": company_data.company_email,
            "password": company_data.password,
            "options": {
                "data": {
                    "user_type": "employer",
                    "company_name": company_data.company_name
                }
            }
        })
        
        if result.user:
            # Create in database with minimal info + defaults
            company_db_data = CompanyCreate(
                company_name=company_data.company_name,
                company_email=company_data.company_email,
                password=company_data.password,
                # All other fields will use default None values from CompanyBase
            )
            db_company = await company_crud.create_company(db, company_db_data)
            
            return {
                "user": result.user,
                "session": result.session,
                "access_token": result.session.access_token,
                "refresh_token": result.session.refresh_token,
                "token_type": "bearer",
                "company_id": db_company.company_id,
                "user_type": "employer",
                "needs_onboarding": True,  # Flag to indicate onboarding needed
                "message": "Company created successfully. Please complete onboarding."
            }
        else:
            raise HTTPException(status_code=400, detail="Supabase signup failed")
            
    except Exception as e:
        if "AuthApiError" in str(type(e)):
            print(f"Supabase Auth Error: {e}")
            raise HTTPException(status_code=400, detail=f"Authentication error: {str(e)}")
        else:
            print(f"General error: {e}")
            raise HTTPException(status_code=400, detail=str(e))

@router.post("/company/login")
async def company_login(credentials: CompanyLogin):
    """Login as a company"""
    try:
        result = supabase.auth.sign_in_with_password({
            "email": credentials.company_email,
            "password": credentials.password
        })
        
        if result.user and result.user.user_metadata.get("user_type") == "employer":
            return {
                "user": result.user,
                "session": result.session,
                "access_token": result.session.access_token,
                "refresh_token": result.session.refresh_token,
                "token_type": "bearer",
                "user_type": "employer"
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid company credentials")
            
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

# === SHARED ENDPOINTS ===
@router.post("/logout")
async def logout():
    """Logout (works for both applicants and companies)"""
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me")
async def get_current_user_info(db: AsyncSession = Depends(get_db)):
    """Get current user information"""
    try:
        # Get current user from Supabase
        user = supabase.auth.get_user()
        if not user.user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        user_type = user.user.user_metadata.get("user_type")
        
        if user_type == "applicant":
            # Get applicant data from database
            db_applicant = await applicant_crud.get_applicant_by_email(db, user.user.email)
            return {
                "user_type": "applicant",
                "supabase_user": user.user,
                "database_user": db_applicant
            }
        elif user_type == "employer":
            # Get company data from database
            db_company = await company_crud.get_company_by_email(db, user.user.email)
            return {
                "user_type": "employer",
                "supabase_user": user.user,
                "database_user": db_company
            }
        else:
            raise HTTPException(status_code=400, detail="Invalid user type")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
