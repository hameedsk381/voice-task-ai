import os
from datetime import datetime, timedelta
from typing import Optional, Dict
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-for-local-development-only")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from app.database import AsyncSessionLocal, UserDB
from sqlalchemy import select
import uuid

class AuthService:
    """Service for handling authentication, hashing, and JWTs"""
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Check if a plain password matches the hash"""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        """Generate a bcrypt hash of a password"""
        return pwd_context.hash(password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Generate a JWT token for a user/business"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def decode_token(token: str) -> Optional[Dict]:
        """Decode and verify a JWT token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            return None

    # --- User/Business Operations ---

    async def register_business(self, email: str, password: str, business_name: str) -> Optional[UserDB]:
        """Register a new business account"""
        async with AsyncSessionLocal() as session:
            # Check if email exists
            result = await session.execute(
                select(UserDB).where(UserDB.email == email)
            )
            if result.scalar_one_or_none():
                return None
            
            user = UserDB(
                id=str(uuid.uuid4()),
                email=email,
                hashed_password=self.get_password_hash(password),
                business_name=business_name,
                created_at=datetime.utcnow()
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
            return user

    async def authenticate_user(self, email: str, password: str) -> Optional[UserDB]:
        """Verify user credentials and return user object"""
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(UserDB).where(UserDB.email == email)
            )
            user = result.scalar_one_or_none()
            if not user or not self.verify_password(password, user.hashed_password):
                return None
            return user

    async def get_business_by_phone(self, phone: str) -> Optional[UserDB]:
        """Look up which business owns a specific Twilio number"""
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(UserDB).where(UserDB.twilio_phone == phone)
            )
            return result.scalar_one_or_none()
