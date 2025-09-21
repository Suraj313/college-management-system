import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models, schemas, security
from typing import List

router = APIRouter(
    prefix="/grades",
    tags=["Grades"]
)

@router.post("/courses/{course_id}", status_code=201, dependencies=[Depends(security.require_permission(["teacher"]))])
def submit_grade_for_student(
    course_id: int, 
    grade: schemas.GradeCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    """
    Endpoint for a teacher to submit or update a grade for a single student 
    in a specific course for a specific assignment.
    """
    logging.info(f"User '{current_user.email}' submitting grade for student {grade.student_id} in course {course_id}.")

    #
    
    # Check if a grade for this student and assignment already exists
    db_grade = db.query(models.Grade).filter(
        models.Grade.student_id == grade.student_id,
        models.Grade.course_id == course_id,
        models.Grade.assignment_name == grade.assignment_name
    ).first()

    if db_grade:
        # Update existing grade
        db_grade.score = grade.score
        db_grade.comments = grade.comments
    else:
        # Create new grade record
        db_grade = models.Grade(**grade.model_dump(), course_id=course_id)
        db.add(db_grade)
    
    db.commit()
    return {"message": "Grade submitted successfully."}

@router.get("/my-grades", response_model=List[schemas.GradeDisplay])
def get_my_grades(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(security.get_current_user)
):
    """
    Endpoint for a student to view all of their own grades.
    """
    if current_user.role != models.UserRole.student:
        raise HTTPException(status_code=403, detail="Only students can view their own grades.")
        
    grades = db.query(models.Grade).filter(models.Grade.student_id == current_user.id).all()
    return grades