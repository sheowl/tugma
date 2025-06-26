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

class JobUpdate(JobBase):
    job_tags: Optional[List[int]] = None  # Array of tag IDs

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
