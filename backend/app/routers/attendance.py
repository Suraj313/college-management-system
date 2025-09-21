import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models, schemas, security
from typing import List
from datetime import date

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)

@router.post("/courses/{course_id}/date/{attendance_date}", status_code=201, dependencies=[Depends(security.require_permission(["teacher"]))])
def submit_attendance(
    course_id: int, 
    attendance_date: date, 
    submission: schemas.AttendanceSubmission, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    logging.info(f"User '{current_user.email}' submitting attendance for course ID {course_id} on {attendance_date}.")
    
    for record in submission.records:
        db_attendance = db.query(models.Attendance).filter(
            models.Attendance.student_id == record.student_id,
            models.Attendance.course_id == course_id,
            models.Attendance.date == attendance_date
        ).first()
        
        if db_attendance:
            db_attendance.status = record.status
        else:
            db_attendance = models.Attendance(
                student_id=record.student_id,
                course_id=course_id,
                date=attendance_date,
                status=record.status
            )
            db.add(db_attendance)
            
    db.commit()
    return {"message": "Attendance submitted successfully."}

@router.get("/my-attendance/courses/{course_id}", response_model=List[schemas.AttendanceDisplay])
def get_my_attendance_for_course(
    course_id: int, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(security.get_current_user)
):
    attendance_records = db.query(models.Attendance).filter(
        models.Attendance.student_id == current_user.id,
        models.Attendance.course_id == course_id
    ).order_by(models.Attendance.date.desc()).all()
    
    return attendance_records