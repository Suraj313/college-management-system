from pydantic import BaseModel, ConfigDict
from . import models 
from typing import List
from datetime import date

#  User & Course Schemas 
class UserRole(str, models.enum.Enum):
    student = "student"
    teacher = "teacher"
    hod = "hod"
    superuser = "superuser"

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class AdminUserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: UserRole

class UserRoleUpdate(BaseModel):
    role: UserRole

class UserDisplay(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    model_config = ConfigDict(from_attributes=True)

class AdminDashboardData(BaseModel):
    message: str
    sensitive_data: str
    active_users: int
    courses_count: int

class Token(BaseModel):
    access_token: str
    token_type: str

class CourseBase(BaseModel):
    name: str
    code: str
    description: str | None = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(CourseBase):
    pass

class CourseDisplay(CourseBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- ADD THESE NEW ATTENDANCE SCHEMAS ---
class AttendanceRecordCreate(BaseModel):
    student_id: int
    status: models.AttendanceStatus

class AttendanceSubmission(BaseModel):
    records: List[AttendanceRecordCreate]

class AttendanceDisplay(BaseModel):
    id: int
    date: date
    status: models.AttendanceStatus
    student_id: int
    course_id: int
    model_config = ConfigDict(from_attributes=True)
    
class GradeBase(BaseModel):
    student_id: int
    assignment_name: str
    score: float
    comments: str | None = None

class GradeCreate(GradeBase):
    pass

class GradeDisplay(GradeBase):
    id: int
    course_id: int
    
    model_config = ConfigDict(from_attributes=True)    
