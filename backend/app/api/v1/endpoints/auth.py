from fastapi import APIRouter, HTTPException, Depends, Request, Header
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from app.middleware.auth import supabase, get_current_user
from app.core.database import get_db
from app.crud import applicant as applicant_crud
from app.crud import company as company_crud
from app.core.auth import get_password_hash
from app.core.email import send_otp_email
from app.schemas.applicant import ApplicantCreate, ApplicantSignUp, ApplicantLogin
from app.schemas.company import CompanySignup, CompanyCreate, CompanyLogin
import random
import time

router = APIRouter()

# In-memory OTP store (for demo/dev only)
applicant_otp_store = {}
company_otp_store = {}

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
async def get_current_user_info(
    db: AsyncSession = Depends(get_db),
    authorization: str = Header(None)
):
    """Get current user information"""
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
        access_token = authorization.split(" ", 1)[1]
        user = supabase.auth.get_user(access_token)
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


# === SUPABASE INTEGRATION ENDPOINTS ===
@router.post("/verify-company")
async def verify_company_user(
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Verify if current user is a company"""
    try:
        print(f"🏢 Verifying company user: {current_user}")
        print(f"🏢 User email: {current_user.get('email', 'Not found')}")
        
        # FIXED: Use dictionary access instead of object access
        user_email = current_user.get('email')
        if not user_email:
            print(f"❌ No email found in current_user: {current_user}")
            raise HTTPException(status_code=403, detail="No email in token")
        
        # Check if user exists in company table
        company = await company_crud.get_company_by_email(db, user_email)
        if company:
            print(f"✅ Company found: {company.company_name}")
            return {
                "company_id": company.company_id,
                "company_name": company.company_name,
                "email": company.company_email,
                "user_type": "employer"
            }
        else:
            print(f"❌ No company found for email: {user_email}")
            raise HTTPException(status_code=403, detail="Not authorized as company")
    except Exception as e:
        print(f"❌ Error verifying company user: {e}")
        print(f"❌ Current user data: {current_user}")
        raise HTTPException(status_code=403, detail="Not authorized as company")

@router.post("/verify-applicant")
async def verify_applicant_user(
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Verify if current user is an applicant"""
    try:
        print(f"👤 Verifying applicant user: {current_user}")
        print(f"👤 User email: {current_user.get('email', 'Not found')}")
        
        # FIXED: Use dictionary access instead of object access
        user_email = current_user.get('email')
        if not user_email:
            print(f"❌ No email found in current_user: {current_user}")
            raise HTTPException(status_code=403, detail="No email in token")
        
        # Check if user exists in applicant table
        applicant = await applicant_crud.get_applicant_by_email(db, user_email)
        if applicant:
            print(f"✅ Applicant found: {applicant.first_name} {applicant.last_name}")
            return {
                "applicant_id": applicant.applicant_id,
                "first_name": applicant.first_name,
                "last_name": applicant.last_name,
                "email": applicant.email,
                "user_type": "applicant"
            }
        else:
            print(f"❌ No applicant found for email: {user_email}")
            raise HTTPException(status_code=403, detail="Not authorized as applicant")
    except Exception as e:
        print(f"❌ Error verifying applicant user: {e}")
        print(f"❌ Current user data: {current_user}")
        raise HTTPException(status_code=403, detail="Not authorized as applicant")

@router.post("/applicant/create-profile")
async def create_applicant_profile(
    applicant_data: dict,
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create applicant profile for Supabase user"""
    try:
        print(f"🏗️ Creating applicant profile for: {current_user}")
        
        # FIXED: Use dictionary access
        user_email = current_user.get('email')
        if not user_email:
            raise HTTPException(status_code=400, detail="No email in token")
        
        # Create applicant record linked to Supabase user
        applicant_create = ApplicantCreate(
            email=user_email,  # FIXED: Use extracted email
            first_name=applicant_data.get("first_name", ""),
            last_name=applicant_data.get("last_name", ""),
            password=""  # Empty for Supabase users
        )
        
        applicant = await applicant_crud.create_applicant(db, applicant_create)
        
        print(f"✅ Applicant profile created: {applicant.first_name} {applicant.last_name}")
        return {
            "applicant_id": applicant.applicant_id,
            "first_name": applicant.first_name,
            "last_name": applicant.last_name,
            "email": applicant.email,
            "user_type": "applicant"
        }
    except Exception as e:
        print(f"❌ Error creating applicant profile: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/company/create-profile")
async def create_company_profile(
    company_data: dict,
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create company profile for Supabase user"""
    try:
        print(f"🏗️ Creating company profile for: {current_user}")
        
        # FIXED: Use dictionary access
        user_email = current_user.get('email')
        if not user_email:
            raise HTTPException(status_code=400, detail="No email in token")
        
        # Create company record linked to Supabase user
        company_create = CompanyCreate(
            company_name=company_data["company_name"],
            company_email=user_email,  # FIXED: Use extracted email
            password=""  # Empty for Supabase users
        )
        
        company = await company_crud.create_company(db, company_create)
        
        print(f"✅ Company profile created: {company.company_name}")
        return {
            "company_id": company.company_id,
            "company_name": company.company_name,
            "email": company.company_email,
            "user_type": "employer"
        }
    except Exception as e:
        print(f"❌ Error creating company profile: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# OTP section for applicants
@router.post("/applicant/send-otp")
async def send_applicant_otp(request: Request):
    data = await request.json()
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    cooldown = 60  # seconds
    now = time.time()
    if email in applicant_otp_store and now - applicant_otp_store[email]["timestamp"] < cooldown:
        raise HTTPException(status_code=429, detail="Please wait before requesting another code.")

    otp = str(random.randint(1000, 9999))
    applicant_otp_store[email] = {"otp": otp, "timestamp": now}

    # Send OTP email 
    send_otp_email(email, otp)

    # For demo: print OTP to backend logs
    print(f"OTP for {email}: {otp}")

    return {"message": "OTP sent to email"}

@router.post("/applicant/verify-otp")
async def verify_applicant_otp(request: Request):
    data = await request.json()
    email = data.get("email")
    otp = data.get("otp")
    if not email or not otp:
        raise HTTPException(status_code=400, detail="Email and OTP are required")

    entry = applicant_otp_store.get(email)
    if not entry:
        raise HTTPException(status_code=400, detail="No OTP found for this email.")

    if entry["otp"] == otp:
        del applicant_otp_store[email]
        return {"message": "OTP verified"}
    else:
        raise HTTPException(status_code=400, detail="The code you entered is incorrect. Please try again or resend a new code.")

# OTP section for companies
@router.post("/company/send-otp")
async def send_company_otp(request: Request):
    data = await request.json()
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    cooldown = 60  # seconds
    now = time.time()
    if email in company_otp_store and now - company_otp_store[email]["timestamp"] < cooldown:
        raise HTTPException(status_code=429, detail="Please wait before requesting another code.")

    otp = str(random.randint(1000, 9999))
    company_otp_store[email] = {"otp": otp, "timestamp": now}

    send_otp_email(email, otp)
    print(f"Company OTP for {email}: {otp}")

    return {"message": "OTP sent to email"}

@router.post("/company/verify-otp")
async def verify_company_otp(request: Request):
    data = await request.json()
    email = data.get("email")
    otp = data.get("otp")
    if not email or not otp:
        raise HTTPException(status_code=400, detail="Email and OTP are required")

    entry = company_otp_store.get(email)
    if not entry:
        raise HTTPException(status_code=400, detail="No OTP found for this email.")

    if entry["otp"] == otp:
        del company_otp_store[email]
        return {"message": "OTP verified"}
    else:
        raise HTTPException(status_code=400, detail="The code you entered is incorrect. Please try again or resend a new code.")

@router.post("/applicant/oauth-register")
async def applicant_oauth_register(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    data = await request.json()
    email = data.get("email")
    first_name = data.get("first_name")
    last_name = data.get("last_name")

    # Check if applicant already exists
    applicant = await applicant_crud.get_applicant_by_email(db, email)
    if applicant:
        return {"message": "Applicant already exists"}

    # Create new applicant
    applicant_data = ApplicantCreate(
        email=email,
        first_name=first_name,
        last_name=last_name,
        password="",  # Leave blank for OAuth users
    )
    new_applicant = await applicant_crud.create_applicant(db, applicant_data)
    return {"message": "Applicant created", "applicant_id": new_applicant.applicant_id}
