from pydantic import BaseModel, ConfigDict
from .models import UserRole

# --- User Schemas ---
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

# --- ADD THESE NEW COURSE SCHEMAS ---
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