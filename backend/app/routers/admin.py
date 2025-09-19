from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import security, models, schemas, database

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(security.require_permission(["superuser"]))]
)

@router.get("/dashboard-data", response_model=schemas.AdminDashboardData)
def get_admin_dashboard_data():
    # ... (existing code)
    return {
        "message": "Welcome, Superuser!",
        "sensitive_data": "Full system-wide administrative data.",
        "active_users": 150,
        "courses_count": 25
    }

@router.post("/create-user", response_model=schemas.UserDisplay)
def create_user_by_admin(user: schemas.AdminUserCreate, db: Session = Depends(database.get_db)):
    # ... (existing code)
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = security.get_password_hash(user.password)
    new_user = models.User(
        name=user.name, 
        email=user.email, 
        hashed_password=hashed_password, 
        role=user.role 
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/users", response_model=list[schemas.UserDisplay])
def get_all_users(db: Session = Depends(database.get_db)):
    # ... (existing code)
    users = db.query(models.User).all()
    return users

# ADD THIS NEW ENDPOINT
@router.put("/users/{user_id}/role", response_model=schemas.UserDisplay)
def update_user_role(user_id: int, role_update: schemas.UserRoleUpdate, db: Session = Depends(database.get_db)):
    """
    Endpoint for a superuser to update a user's role.
    """
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update the user's role and save to the database
    db_user.role = role_update.role
    db.commit()
    db.refresh(db_user)
    
    return db_user