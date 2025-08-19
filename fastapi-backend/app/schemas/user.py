from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str

class UserResponse(BaseModel):
    userId: int
    name: str
    createdAt: Optional[str] = None
    
    class Config:
        from_attributes = True