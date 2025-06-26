# schemas/company.py
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Dict
from app.models.enums import CompanySizeEnum

class CompanyBase(BaseModel):
    company_name: str
    company_email: EmailStr
    location: Optional[str] = None
    description: Optional[str] = None
    company_size: Optional[CompanySizeEnum] = None
    employer_profile_picture: Optional[str] = None
    contact_links: Optional[Dict[str, str]] = Field(default_factory=dict)

# Minimal schema for signup - only essential fields
class CompanySignup(BaseModel):
    company_name: str
    company_email: EmailStr
    password: str

class CompanyCreate(CompanyBase):
    password: str

class CompanyUpdate(BaseModel):
    company_name: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    company_size: Optional[CompanySizeEnum] = None
    employer_profile_picture: Optional[str] = None
    contact_links: Optional[Dict[str, str]] = None

# NEW: Specific schema for onboarding - only the 3 required fields
class CompanyOnboardingUpdate(BaseModel):
    location: str
    description: str
    company_size: CompanySizeEnum

class CompanyOut(CompanyBase):
    company_id: int

    model_config = {"from_attributes": True}

class CompanyLogin(BaseModel):
    company_email: EmailStr
    password: str
