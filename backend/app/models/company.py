from sqlalchemy import Integer, String, Text, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base
from app.models.enums import CompanySizeEnum


class Company(Base):
    __tablename__ = "Company"

    company_id: Mapped[int] = mapped_column(primary_key=True)
    company_name: Mapped[str] = mapped_column(String, nullable=False)
    company_email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[str] = mapped_column(String, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    company_size: Mapped[CompanySizeEnum] = mapped_column(Enum(CompanySizeEnum), nullable=True)
    employer_profile_picture: Mapped[str] = mapped_column(Text, nullable=True)
    contact_links: Mapped[dict] = mapped_column(JSON, nullable=True)

