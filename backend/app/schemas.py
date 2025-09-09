from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .models import UserRole

# --- User Schemas ---
class UserBase(BaseModel):
    email: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- QMS Event Schemas ---
class QMSEventBase(BaseModel):
    title: str
    event_type: str
    description: str
    occurrence_date: datetime
    reported_by: str
    location: str
    severity: str
    risk: str
    status: str
    root_cause_summary: Optional[str] = None
    capa_summary: Optional[str] = None

class QMSEventCreate(QMSEventBase):
    pass

class QMSEvent(QMSEventBase):
    id: int
    event_id_str: str
    created_at: datetime
    class Config:
        from_attributes = True

class AIPrompt(BaseModel):
    prompt: str

class EventsDeleteRequest(BaseModel):
    ids: List[int]