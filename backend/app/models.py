from sqlalchemy import Column, Integer, String, Enum as SQLAlchemyEnum, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from .database import Base
import enum

#  UserRole, User, Course, AttendanceStatus, Attendance models 
class UserRole(str, enum.Enum):
    student = "student"
    teacher = "teacher"
    hod = "hod"
    superuser = "superuser"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLAlchemyEnum(UserRole), nullable=False)

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    code = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)

class AttendanceStatus(str, enum.Enum):
    present = "present"
    absent = "absent"
    late = "late"

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    status = Column(SQLAlchemyEnum(AttendanceStatus), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    student = relationship("User")
    course = relationship("Course")

# --- ADD THIS NEW GRADE MODEL ---
class Grade(Base):
    __tablename__ = "grades"
    id = Column(Integer, primary_key=True, index=True)
    assignment_name = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    comments = Column(String, nullable=True)
    
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))

    student = relationship("User")
    course = relationship("Course")