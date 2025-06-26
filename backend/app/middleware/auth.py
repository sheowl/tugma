from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.database import get_db
from jose import jwt, JWTError

# Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
security = HTTPBearer()

def verify_supabase_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify Supabase JWT token directly using the project's JWT secret."""
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        print(f"Token payload: {payload}")  # Debugging line to log the payload
        return payload
    except JWTError as e:
        print("JWTError: ", e)
        print("Token received for verification:", token)  # Debugging line to log the received token
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Get current authenticated user"""
    user_data = verify_supabase_token(credentials.credentials)
    print(f"User data from token: {user_data}")  # Debugging line to log user data
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_data

async def get_current_company(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current company with database data"""
    user_type = current_user.get("user_metadata", {}).get("user_type")
    if user_type != "employer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employer access required"
        )
    
    # Get company data from database
    email = current_user.get("email")
    from app.crud import company as company_crud
    db_company = await company_crud.get_company_by_email(db, email)
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found in database")
    
    return {
        "supabase_user": current_user,
        "db_user": db_company
    }

async def get_current_applicant(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current applicant with database data"""
    user_type = current_user.get("user_metadata", {}).get("user_type")
    if user_type != "applicant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Applicant access required"
        )
    
    # Get applicant data from database
    email = current_user.get("email")
    from app.crud import applicant as applicant_crud
    db_applicant = await applicant_crud.get_applicant_by_email(db, email)
    if not db_applicant:
        raise HTTPException(status_code=404, detail="Applicant not found in database")
    
    return {
        "supabase_user": current_user,
        "db_user": db_applicant
    }

# Legacy functions for backward compatibility
def require_employer(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Require employer role (legacy)"""
    user_type = current_user.get("user_metadata", {}).get("user_type")
    if user_type != "employer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employer access required"
        )
    return current_user

def require_applicant(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Require applicant role (legacy)"""
    user_type = current_user.get("user_metadata", {}).get("user_type")
    if user_type != "applicant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Applicant access required"
        )
    return current_user