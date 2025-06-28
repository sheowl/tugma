# schemas/tag.py
from pydantic import BaseModel
from typing import Optional

class TagCategoryBase(BaseModel):
    category_name: str

class TagCategoryCreate(TagCategoryBase):
    pass

class TagCategoryOut(TagCategoryBase):
    category_id: int

    model_config = {"from_attributes": True}

class TagBase(BaseModel):
    tag_name: str
    category_id: Optional[int]

class TagCreate(TagBase):
    pass

class TagOut(TagBase):
    tag_id: int

    model_config = {"from_attributes": True}

class TagIdsRequest(BaseModel):
    tag_ids: list[int]