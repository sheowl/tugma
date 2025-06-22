from sqlalchemy import Integer, String, Text, Enum, Date, Numeric, ForeignKey, Boolean, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import ENUM
from app.models.base import Base
from app.models.enums import WorkSettingEnum, WorkTypeEnum
from datetime import date


class Job(Base):
    __tablename__ = "Job"

    job_id: Mapped[int] = mapped_column(primary_key=True)
    job_title: Mapped[str] = mapped_column(String, nullable=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("Company.company_id"), nullable=True)
    salary_min: Mapped[float] = mapped_column(Numeric, nullable=True)
    salary_max: Mapped[float] = mapped_column(Numeric, nullable=True)
    setting: Mapped[WorkSettingEnum] = mapped_column(
        ENUM('onsite', 'remote', 'hybrid', name='worksetting_enum', create_type=False),
        nullable=True
    )
    work_type: Mapped[WorkTypeEnum] = mapped_column(
        ENUM('fulltime', 'part-time', 'contractual', 'internship', name='worktype_enum', create_type=False),
        nullable=True
    )
    description: Mapped[str] = mapped_column(Text, nullable=True)
    date_added: Mapped[date] = mapped_column(nullable=True)
    created_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    position_count: Mapped[int] = mapped_column(Integer, nullable=True)
    required_category_id: Mapped[int] = mapped_column(ForeignKey("TagCategory.category_id"), nullable=True)
    required_proficiency: Mapped[int] = mapped_column(Integer, nullable=True)


class JobTag(Base):
    __tablename__ = "Job_Tags"

    job_id: Mapped[int] = mapped_column(ForeignKey("Job.job_id"), primary_key=True)
    tag_id: Mapped[int] = mapped_column(ForeignKey("Tags.tag_id"), primary_key=True)
    is_required: Mapped[bool] = mapped_column(Boolean, default=True)

