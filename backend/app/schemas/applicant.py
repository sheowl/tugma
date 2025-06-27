# schemas/applicant.py
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import date
from app.models.enums import MainFieldEnum, WorkSettingEnum, WorkTypeEnum

# Shared fields between create/update/out
class ApplicantBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    current_address: Optional[str] = None
    contact_number: Optional[str] = None
    telephone_number: Optional[str] = None
    university: Optional[str] = None
    degree: Optional[str] = None
    year_graduated: Optional[int] = None
    field: Optional[MainFieldEnum] = None
    preferred_worksetting: Optional[WorkSettingEnum] = None
    preferred_worktype: Optional[WorkTypeEnum] = None
    applicant_profile_picture: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None

# For creating a new applicant
class ApplicantCreate(ApplicantBase):
    email: EmailStr
    password: str

# For updating an existing applicant
class ApplicantUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    current_address: Optional[str] = None
    contact_number: Optional[str] = None
    telephone_number: Optional[str] = None
    university: Optional[str] = None
    degree: Optional[str] = None
    year_graduated: Optional[int] = None
    field: Optional[MainFieldEnum] = None
    preferred_worksetting: Optional[WorkSettingEnum] = None
    preferred_worktype: Optional[WorkTypeEnum] = None
    applicant_profile_picture: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None

# For responses
class ApplicantOut(BaseModel):
    applicant_id: int
    applicant_email: str
    first_name: str
    last_name: str
    current_address: Optional[str] = None
    contact_number: Optional[str] = None
    telephone_number: Optional[str] = None
    university: Optional[str] = None
    degree: Optional[str] = None
    year_graduated: Optional[int] = None
    field: Optional[MainFieldEnum] = None
    preferred_worksetting: Optional[WorkSettingEnum] = None
    preferred_worktype: Optional[WorkTypeEnum] = None
    applicant_profile_picture: Optional[str] = None
    social_links: Optional[dict] = None

    class Config:
        from_attributes = True  # For Pydantic v2, use from_attributes instead of orm_mode

# Applicant Work Experience
class ApplicantWorkExperienceBase(BaseModel):
    company: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None

class ApplicantWorkExperienceCreate(ApplicantWorkExperienceBase):
    pass

class ApplicantWorkExperienceOut(ApplicantWorkExperienceBase):
    exp_id: int
    applicant_id: int

    model_config = {"from_attributes": True}

# Applicant Certificate
class ApplicantCertificateBase(BaseModel):
    certificate_name: str
    certificate_description: Optional[str] = None

class ApplicantCertificateCreate(ApplicantCertificateBase):
    pass

class ApplicantCertificateOut(ApplicantCertificateBase):
    applicant_id: int

    model_config = {"from_attributes": True}

# === APPLICANT AUTH SCHEMAS ===
class ApplicantSignUp(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str

class ApplicantLogin(BaseModel):
    email: EmailStr
    password: str

# For onboarding status
class ApplicantOnboardingStatus(BaseModel):
    needs_onboarding: bool
    completed_fields: dict[str, bool]

# Applicant Proficiency
class ApplicantProficiencyBase(BaseModel):
    category_id: int  
    proficiency: int  

class ApplicantProficiencyCreate(ApplicantProficiencyBase):
    pass

class ApplicantProficiencyOut(ApplicantProficiencyBase):
    applicant_id: int

    class Config:
        from_attributes = True  # For Pydantic v2
