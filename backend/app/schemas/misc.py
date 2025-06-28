# schemas/misc.py
from pydantic import BaseModel
from typing import Optional, Generic, TypeVar, List
from datetime import datetime

# only use if we standardize error responses 

# Generic type for reusable response wrappers
# T = TypeVar("T")

# Token schema for authentication responses
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None
    applicant_id: Optional[int] = None
    company_id: Optional[int] = None
    role: Optional[str] = None

# # Generic pagination response
# class PaginatedResponse(BaseModel, Generic[T]):
#     total: int
#     page: int
#     size: int
#     items: List[T]

# # Generic API response wrapper (optional use)
# class APIResponse(BaseModel, Generic[T]):
#     status: str = "success"
#     message: Optional[str]
#     data: Optional[T]

# # Error schema
# class ErrorResponse(BaseModel):
#     detail: str
#     timestamp: Optional[datetime] = datetime.utcnow()

