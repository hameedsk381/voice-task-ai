from enum import Enum
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TaskStatus(str, Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    ESCALATED = "escalated"
    CLOSED = "closed"


class UrgencyLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ServiceIntent(str, Enum):
    AC_REPAIR = "AC Repair"
    PLUMBING = "Plumbing"
    ELECTRICAL = "Electrical"
    GENERAL_MAINTENANCE = "General Maintenance"
    CLINIC_APPOINTMENT = "Clinic Appointment"
    PROPERTY_INSPECTION = "Property Inspection"
    PEST_CONTROL = "Pest Control"
    PAINTING = "Painting"
    CARPENTRY = "Carpentry"
    OTHER = "Other"


class WorkerStatus(str, Enum):
    AVAILABLE = "available"
    BUSY = "busy"
    OFFLINE = "offline"


class Task(BaseModel):
    """Task model representing a service request"""
    id: str
    business_id: str  # Tenant identifier
    intent: str
    issue: str
    urgency: str
    location: Optional[str] = None
    preferred_time: Optional[str] = None
    confidence: float
    status: str
    customer_phone: str
    customer_name: Optional[str] = None
    transcript: str
    created_at: datetime
    updated_at: datetime
    escalation_reason: Optional[str] = None
    assigned_to: Optional[str] = None
    assigned_worker_name: Optional[str] = None


class CallLog(BaseModel):
    """Log of all voice interactions"""
    id: str
    business_id: str
    phone_number: str
    audio_url: Optional[str] = None
    transcript: str
    confidence_score: float
    duration_seconds: Optional[int] = None
    created_at: datetime
    task_id: Optional[str] = None
    success: bool


class FailureLog(BaseModel):
    """Log of system failures"""
    id: str
    business_id: Optional[str] = None
    error_message: str
    phone_number: Optional[str] = None
    context: Optional[str] = None
    created_at: datetime


class Worker(BaseModel):
    """Worker model for service providers"""
    id: str
    business_id: str
    name: str
    phone: str
    skills: list[str]
    status: str
    current_tasks: int
    max_tasks: int
    rating: Optional[float] = None
    total_jobs: int
    created_at: datetime
    updated_at: datetime


# --- Authentication Models ---

class UserBase(BaseModel):
    email: str
    business_name: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str
    hashed_password: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    business_id: Optional[str] = None
