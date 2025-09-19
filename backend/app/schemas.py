from pydantic import BaseModel, ConfigDict
from .models import UserRole

# For public signup (students only)
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

# For admin panel user creation
class AdminUserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: UserRole

# For updating a user's role
class UserRoleUpdate(BaseModel):
    role: UserRole

# ADD THIS NEW SCHEMA
# For the admin dashboard data response
class AdminDashboardData(BaseModel):
    message: str
    sensitive_data: str
    active_users: int
    courses_count: int

# For displaying user information
class UserDisplay(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    model_config = ConfigDict(from_attributes=True)

# For the login response token
class Token(BaseModel):
    access_token: str
    token_type: str