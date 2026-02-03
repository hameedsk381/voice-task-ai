from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, Text
import os
from datetime import datetime
import uuid

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./data/receptionist.db")

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


class UserDB(Base):
    """Database model for registered businesses/users"""
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    business_name = Column(String, nullable=False)
    twilio_phone = Column(String, index=True, nullable=True)  # Map incoming calls to this business
    created_at = Column(DateTime, default=datetime.utcnow)


class TaskDB(Base):
    """Database model for tasks"""
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id = Column(String, index=True, nullable=False)
    intent = Column(String, nullable=False)
    issue = Column(Text, nullable=False)
    urgency = Column(String, nullable=False)
    location = Column(String, nullable=True)
    preferred_time = Column(String, nullable=True)
    confidence = Column(Float, nullable=False)
    status = Column(String, default="new")
    customer_phone = Column(String, nullable=False)
    customer_name = Column(String, nullable=True)
    transcript = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    escalation_reason = Column(String, nullable=True)
    assigned_to = Column(String, nullable=True)  # Worker ID
    assigned_worker_name = Column(String, nullable=True)  # Worker name for quick display


class WorkerDB(Base):
    """Database model for workers/service providers"""
    __tablename__ = "workers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    skills = Column(Text, nullable=False)  # JSON string of skills array
    status = Column(String, default="available")  # available, busy, offline
    current_tasks = Column(Integer, default=0)
    max_tasks = Column(Integer, default=5)
    rating = Column(Float, nullable=True)
    total_jobs = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CallLogDB(Base):
    """Database model for call logs"""
    __tablename__ = "call_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id = Column(String, index=True, nullable=False)
    phone_number = Column(String, nullable=False)
    audio_url = Column(String, nullable=True)
    transcript = Column(Text, nullable=False)
    confidence_score = Column(Float, nullable=False)
    duration_seconds = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    task_id = Column(String, nullable=True)
    success = Column(Boolean, default=True)


class FailureLogDB(Base):
    """Database model for failure logs"""
    __tablename__ = "failure_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id = Column(String, index=True, nullable=True)
    error_message = Column(Text, nullable=False)
    phone_number = Column(String, nullable=True)
    context = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


async def init_db():
    """Initialize database tables"""
    import os
    os.makedirs("./data", exist_ok=True)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    """Get database session"""
    async with AsyncSessionLocal() as session:
        yield session
