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

class JobOut(JobBase):
    job_id: int
    company_id: int
    applicant_count: Optional[int] = 0
    job_tags: List[int] = []  # Simple array of tag IDs

    model_config = {"from_attributes": True}

class CompanyJobsResponse(BaseModel):
    jobs: List[JobOut]
    total: int
    company_info: dict
