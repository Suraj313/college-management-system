from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models, schemas, security
from typing import List

router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)

# CREATE a new course (HODs & Superusers only)
@router.post("/", response_model=schemas.CourseDisplay, dependencies=[Depends(security.require_permission(["hod", "superuser"]))])
def create_course(course: schemas.CourseCreate, db: Session = Depends(database.get_db)):
    db_course = models.Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

# READ all courses (All logged-in users)
@router.get("/", response_model=List[schemas.CourseDisplay])
def get_all_courses(db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    courses = db.query(models.Course).all()
    return courses

# READ a single course by ID (All logged-in users)
@router.get("/{course_id}", response_model=schemas.CourseDisplay)
def get_course(course_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

# UPDATE a course (HODs & Superusers only)
@router.put("/{course_id}", response_model=schemas.CourseDisplay, dependencies=[Depends(security.require_permission(["hod", "superuser"]))])
def update_course(course_id: int, course_update: schemas.CourseUpdate, db: Session = Depends(database.get_db)):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    for key, value in course_update.model_dump(exclude_unset=True).items():
        setattr(db_course, key, value)
    
    db.commit()
    db.refresh(db_course)
    return db_course

# DELETE a course (Superusers only)
@router.delete("/{course_id}", status_code=204, dependencies=[Depends(security.require_permission(["superuser"]))])
def delete_course(course_id: int, db: Session = Depends(database.get_db)):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    db.delete(db_course)
    db.commit()
    return {"ok": True}