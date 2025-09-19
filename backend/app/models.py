# models.py
from sqlalchemy import Column, Integer, String, Enum as SQLAlchemyEnum
from .database import Base
import enum

class UserRole(str, enum.Enum):
    student = "student"
    teacher = "teacher"
    hod = "hod"
    superuser = "superuser" 


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False) # Ensure this line exists
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLAlchemyEnum(UserRole), nullable=False)