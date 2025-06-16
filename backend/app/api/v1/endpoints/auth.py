from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from app.models.applicant import Applicant
from app.models.company import Company
from app.core.auth import verify_password, create_access_token
from app.core.database import get_db
from app.schemas.auth import Token
from sqlalchemy.future import select

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # Try logging in as Applicant
    result = await db.execute(select(Applicant).where(Applicant.email == form_data.username))
    applicant = result.scalars().first()
    
    if applicant and verify_password(form_data.password, applicant.password):
        token_data = {
            "sub": applicant.email,
            "role": "applicant",
            "id": applicant.applicant_id
        }
        access_token = create_access_token(data=token_data)
        return {"access_token": access_token, "token_type": "bearer"}

    # Try logging in as Employer
    result = await db.execute(select(Company).where(Company.company_email == form_data.username))
    company = result.scalars().first()
    
    if company and verify_password(form_data.password, company.password):
        token_data = {
            "sub": company.company_email,
            "role": "employer",
            "id": company.company_id
        }
        access_token = create_access_token(data=token_data)
        return {"access_token": access_token, "token_type": "bearer"}

    # If both fail
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )
