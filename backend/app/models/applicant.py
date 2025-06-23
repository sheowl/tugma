from sqlalchemy import Integer, String, Text, JSON, ForeignKey, Boolean, Date
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import ENUM
from app.models.base import Base
from app.models.enums import MainFieldEnum, WorkSettingEnum, WorkTypeEnum
from datetime import date

class Applicant(Base):
    __tablename__ = "Applicant"

    applicant_id: Mapped[int] = mapped_column(primary_key=True)
    applicant_email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String, nullable=False)
    last_name: Mapped[str] = mapped_column(String, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    current_address: Mapped[str] = mapped_column(Text, nullable=True)
    contact_number: Mapped[str] = mapped_column(String, nullable=True)
    telephone_number: Mapped[str] = mapped_column(String, nullable=True)
    university: Mapped[str] = mapped_column(String, nullable=True)
    degree: Mapped[str] = mapped_column(String, nullable=True)
    year_graduated: Mapped[int] = mapped_column(Integer, nullable=True)
    field: Mapped[MainFieldEnum] = mapped_column(ENUM('Software Development', 'Infrastructure & System', 'AI/ML', 'Data Science', 'Cybersecurity', 'UI/UX', name="main_field_enum"), nullable=True)
    preferred_worksetting: Mapped[WorkSettingEnum] = mapped_column(ENUM('hybrid', 'remote', 'onsite', name="worksetting_enum"), nullable=True)
    preferred_worktype: Mapped[WorkTypeEnum] = mapped_column(ENUM('part-time', 'fulltime', 'contractual', 'internship', name="worktype_enum"), nullable=True)
    applicant_profile_picture: Mapped[str] = mapped_column(Text, nullable=True)
    social_links: Mapped[dict] = mapped_column(JSON, nullable=True)


class ApplicantTag(Base):
    __tablename__ = "Applicant_Tags"

    tag_id: Mapped[int] = mapped_column(ForeignKey("Tags.tag_id"), primary_key=True)
    applicant_id: Mapped[int] = mapped_column(ForeignKey("Applicant.applicant_id"), primary_key=True)
    is_tagged: Mapped[bool] = mapped_column(Boolean, default=False)


class ApplicantProficiency(Base):
    __tablename__ = "Applicant_Proficiency"

    applicant_id: Mapped[int] = mapped_column(ForeignKey("Applicant.applicant_id"), primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("TagCategory.category_id"), primary_key=True)
    proficiency: Mapped[int] = mapped_column(Integer, nullable=False)


class ApplicantWorkExperience(Base):
    __tablename__ = "Applicant_WorkExperience"

    exp_id: Mapped[int] = mapped_column(primary_key=True)
    applicant_id: Mapped[int] = mapped_column(ForeignKey("Applicant.applicant_id"))
    company: Mapped[str] = mapped_column(String, nullable=False)
    start_date: Mapped[date] = mapped_column(nullable=True)
    end_date: Mapped[date] = mapped_column(nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)


class ApplicantCertificate(Base):
    __tablename__ = "Applicant_Certificates"

    applicant_id: Mapped[int] = mapped_column(ForeignKey("Applicant.applicant_id"), primary_key=True)
    certificate_name: Mapped[str] = mapped_column(String, primary_key=True)
    certificate_description: Mapped[str] = mapped_column(String, nullable=True)

