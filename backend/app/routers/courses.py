import logging
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from .. import database, models, schemas, security
from typing import List

router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)

# CREATE a new course (HODs & Superusers only)
@router.post("/", response_model=schemas.CourseDisplay, dependencies=[Depends(security.require_permission(["hod", "superuser"]))])
def create_course(course: schemas.CourseCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    logging.info(f"User '{current_user.email}' attempting to create course with code '{course.code}'.")
    
    db_course = models.Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)

    logging.info(f"Course '{db_course.name}' (ID: {db_course.id}) created successfully by '{current_user.email}'.")
    return db_course

# READ all courses 
@router.get("/", response_model=List[schemas.CourseDisplay])
def get_all_courses(db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    courses = db.query(models.Course).all()
    return courses

# READ a single course by ID (All logged-in users)
@router.get("/{course_id}", response_model=schemas.CourseDisplay)
def get_course(course_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        logging.warning(f"User '{current_user.email}' failed to find course with ID {course_id}.")
        raise HTTPException(status_code=404, detail="Course not found")
    return course

# UPDATE a course (HODs & Superusers only)
@router.put("/{course_id}", response_model=schemas.CourseDisplay, dependencies=[Depends(security.require_permission(["hod", "superuser"]))])
def update_course(course_id: int, course_update: schemas.CourseUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not db_course:
        logging.warning(f"User '{current_user.email}' failed to update non-existent course with ID {course_id}.")
        raise HTTPException(status_code=404, detail="Course not found")
    
    logging.info(f"User '{current_user.email}' is updating course '{db_course.name}' (ID: {db_course.id}).")
    for key, value in course_update.model_dump(exclude_unset=True).items():
        setattr(db_course, key, value)
    
    db.commit()
    db.refresh(db_course)
    return db_course


@router.get("/{course_id}/students", response_model=List[schemas.UserDisplay], dependencies=[Depends(security.require_permission(["teacher", "hod", "superuser"]))])
def get_students_in_course(course_id: int, db: Session = Depends(database.get_db)):
    """
    Gets a list of all students. In a real application, this would check
    for actual enrollment in the specified course.
    """
    students = db.query(models.User).filter(models.User.role == models.UserRole.student).all()
    return students

# DELETE a course (Superusers only)
@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(security.require_permission(["superuser"]))])
def delete_course(course_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(security.get_current_user)):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not db_course:
        logging.warning(f"User '{current_user.email}' attempted to delete non-existent course with ID {course_id}.")
        raise HTTPException(status_code=404, detail="Course not found")
    
    logging.info(f"User '{current_user.email}' is deleting course '{db_course.name}' (ID: {db_course.id}).")
    db.delete(db_course)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)