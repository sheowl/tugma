# schemas/company.py
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Dict
from app.models.enums import CompanySizeEnum

class CompanyBase(BaseModel):
    company_name: str
    company_email: EmailStr
    location: Optional[str]
    description: Optional[str]
    company_size: Optional[CompanySizeEnum]
    employer_profile_picture: Optional[str]
    contact_links: Optional[Dict[str, str]] = Field(default_factory=dict)

class CompanyCreate(CompanyBase):
    company_email: EmailStr
    password: str

class CompanyUpdate(BaseModel):
    location: Optional[str]
    description: Optional[str]
    company_size: Optional[CompanySizeEnum]
    employer_profile_picture: Optional[str]
    contact_links: Optional[Dict[str, str]]

class CompanyOut(CompanyBase):
    company_id: int

    model_config = {"from_attributes": True}
