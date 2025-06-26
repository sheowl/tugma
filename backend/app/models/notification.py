from sqlalchemy import Integer, String, Text, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class Notification(Base):
    __tablename__ = "Notification"

    notification_id: Mapped[int] = mapped_column(primary_key=True)
    recipient_applicant_id: Mapped[int] = mapped_column(ForeignKey("Applicant.applicant_id"))
    job_id: Mapped[int] = mapped_column(ForeignKey("Job.job_id"))
    type: Mapped[str] = mapped_column(String, nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, nullable=True)
    created_at: Mapped[str] = mapped_column(TIMESTAMP, nullable=True)

