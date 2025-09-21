from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import database, models, schemas, security

router = APIRouter(
    prefix="/auth", 
    tags=["Authentication"]
)

@router.post("/signup", response_model=schemas.UserDisplay)
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user.password)
    
    new_user = models.User(
        name=user.name, 
        email=user.email, 
        hashed_password=hashed_password, 
        role=models.UserRole.student # This ensures all public signups are students.
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = security.create_access_token(
        data={"sub": user.email, "role": user.role.value, "name": user.name}
    )
    return {"access_token": access_token, "token_type": "bearer"}