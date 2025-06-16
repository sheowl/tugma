from sqlalchemy import Integer, String, Date, Time, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base
from app.models.enums import InterviewTypeEnum, InterviewStatusEnum
from datetime import date, time


class InterviewDetails(Base):
    __tablename__ = "Interview_Details"

    applicant_id: Mapped[int] = mapped_column(ForeignKey("Applicant.applicant_id"), primary_key=True)
    job_id: Mapped[int] = mapped_column(ForeignKey("Job.job_id"), primary_key=True)
    interview_type: Mapped[InterviewTypeEnum] = mapped_column(Enum(InterviewTypeEnum), nullable=True)
    interview_date: Mapped[date] = mapped_column(nullable=True)
    interview_time: Mapped[time] = mapped_column(nullable=True)
    remarks: Mapped[str] = mapped_column(String, nullable=True)
    interview_status: Mapped[InterviewStatusEnum] = mapped_column(Enum(InterviewStatusEnum), nullable=True)

