# schemas/jobs.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal
from app.models.enums import WorkSettingEnum, WorkTypeEnum

class JobBase(BaseModel):
    job_title: str
    salary_min: Optional[Decimal]
    salary_max: Optional[Decimal]
    setting: Optional[WorkSettingEnum]
    work_type: Optional[WorkTypeEnum]
    description: Optional[str]
    date_added: Optional[date]
    created_at: Optional[datetime]
    position_count: Optional[int]
    required_category_id: Optional[int]
    required_proficiency: Optional[int]

class JobCreate(JobBase):
    company_id: int
    job_tags: Optional[List[int]] = []  # Array of tag IDs

class JobUpdate(BaseModel):
    job_title: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    setting: Optional[str] = None
    work_type: Optional[str] = None
    description: Optional[str] = None
    position_count: Optional[int] = None
    required_category_id: Optional[int] = None
    required_proficiency: Optional[int] = None
    job_tags: Optional[List[int]] = None
    # Remove date_added and created_at from updates - these should be immutable

class JobOut(BaseModel):
    job_id: int
    job_title: str
    company_id: int
    company_name: str  # ADD: Resolved company name
    company_location: Optional[str] = None  # ADD: Resolved company location
    company_description: Optional[str] = None  # ADD: Resolved company description
    location: Optional[str] = None  # Job location (use company location)
    salary_min: Optional[int] = 0
    salary_max: Optional[int] = 0
    salary_frequency: Optional[str] = "monthly"
    setting: Optional[str] = None
    work_type: Optional[str] = None
    description: Optional[str] = None
    position_count: Optional[int] = 1
    required_category_id: Optional[int] = None
    category_name: Optional[str] = None  # ADD: Resolved category name
    required_proficiency: Optional[int] = 1
    job_tags: Optional[List[int]] = []
    created_at: Optional[str] = None
    date_added: Optional[str] = None

    class Config:
        from_attributes = True

class CompanyJobsResponse(BaseModel):
    jobs: List[JobOut]
    total: int
    company_info: dict
