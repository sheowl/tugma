# app/api/v1/endpoints/tag.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.tags import TagCreate, TagOut, TagCategoryCreate, TagCategoryOut
from app.core.database import get_db
from app.crud import tags as crud

router = APIRouter(prefix="/tags", tags=["tags"])

# === TAG CATEGORY ROUTES ===

@router.get("/categories", response_model=List[TagCategoryOut])
async def get_all_categories(db: AsyncSession = Depends(get_db)):
    return await crud.get_all_categories(db)

@router.post("/categories", response_model=TagCategoryOut)
async def create_category(category: TagCategoryCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_category(db, category)

# === TAG ROUTES ===

@router.get("/", response_model=List[TagOut])
async def get_all_tags(db: AsyncSession = Depends(get_db)):
    return await crud.get_all_tags(db)

@router.post("/", response_model=TagOut)
async def create_tag(tag: TagCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_tag(db, tag)

@router.get("/category/{category_id}", response_model=List[TagOut])
async def get_tags_by_category(category_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_tags_by_category(db, category_id)


