# schemas/job.py
from pydantic import BaseModel, Field
from typing import Optional
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

class JobUpdate(JobBase):
    pass

class JobOut(JobBase):
    job_id: int
    company_id: int

    model_config = {"from_attributes": True}

