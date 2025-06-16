from sqlalchemy import Integer, String, ForeignKey, TIMESTAMP, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class JobApplication(Base):
    __tablename__ = "Job_Application"

    applicant_id: Mapped[int] = mapped_column(ForeignKey("Applicant.applicant_id"), primary_key=True)
    job_id: Mapped[int] = mapped_column(ForeignKey("Job.job_id"), primary_key=True)
    status: Mapped[str] = mapped_column(String, nullable=True)
    remarks: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[str] = mapped_column(TIMESTAMP, nullable=True)


class JobMatching(Base):
    __tablename__ = "Job_Matching"

    applicant_id: Mapped[int] = mapped_column(ForeignKey("Applicant.applicant_id"), primary_key=True)
    job_id: Mapped[int] = mapped_column(ForeignKey("Job.job_id"), primary_key=True)
    match_score: Mapped[float] = mapped_column(Numeric, nullable=True)

