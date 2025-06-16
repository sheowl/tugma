# crud/tag.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.models.tags import Tags, TagCategory
from app.schemas.tags import TagCreate, TagCategoryCreate

# Fetch all tag categories
async def get_all_categories(db: AsyncSession) -> List[TagCategory]:
    result = await db.execute(select(TagCategory))
    return list(result.scalars().all())

# Create a new category
async def create_category(db: AsyncSession, category_in: TagCategoryCreate) -> TagCategory:
    category = TagCategory(**category_in.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category

# Fetch all tags
async def get_all_tags(db: AsyncSession) -> List[Tags]:
    result = await db.execute(select(Tags))
    return list(result.scalars().all())

# Create a new tag
async def create_tag(db: AsyncSession, tag_in: TagCreate) -> Tags:
    tag = Tags(**tag_in.model_dump())
    db.add(tag)
    await db.commit()
    await db.refresh(tag)
    return tag

# Get tags by category
async def get_tags_by_category(db: AsyncSession, category_id: int) -> List[Tags]:
    result = await db.execute(select(Tags).where(Tags.category_id == category_id))
    return list(result.scalars().all())

