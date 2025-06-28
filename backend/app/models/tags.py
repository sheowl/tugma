from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class TagCategory(Base):
    __tablename__ = "TagCategory"

    category_id: Mapped[int] = mapped_column(primary_key=True)
    category_name: Mapped[str] = mapped_column(String, unique=True, nullable=False)


class Tags(Base):
    __tablename__ = "Tags"

    tag_id: Mapped[int] = mapped_column(primary_key=True)
    tag_name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("TagCategory.category_id"), nullable=True)

