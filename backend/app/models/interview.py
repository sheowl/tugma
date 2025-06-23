from sqlalchemy import Integer, String, Date, Time, ForeignKey
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.models.base import Base
from app.models.enums import InterviewTypeEnum, InterviewStatusEnum
from datetime import date, time


class InterviewDetails(Base):
    __tablename__ = "Interview_Details"

    applicant_id: Mapped[int] = mapped_column(ForeignKey("Applicant.applicant_id"), primary_key=True)
    job_id: Mapped[int] = mapped_column(ForeignKey("Job.job_id"), primary_key=True)
    interview_type: Mapped[InterviewTypeEnum] = mapped_column(ENUM('onsite', 'phone_call', 'online', name="interview_type_enum"), nullable=False)
    interview_date: Mapped[date] = mapped_column(Date, nullable=False)
    interview_time: Mapped[time] = mapped_column(Time, nullable=False)
    remarks: Mapped[str] = mapped_column(String, nullable=True)
    interview_status: Mapped[InterviewStatusEnum] = mapped_column(ENUM('cancelled', 'confirmed', name="interview_status_enum"), nullable=False)

    # Add relationships if needed
    # applicant = relationship("Applicant", back_populates="interviews")
    # job = relationship("Job", back_populates="interviews")

