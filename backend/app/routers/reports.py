import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models, schemas, security
from typing import List
from datetime import date

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

#Pydantic Schemas for Responses
class AttendanceDisplayWithStudentName(schemas.AttendanceDisplay):
    student_name: str

class GradeDisplayWithStudentName(schemas.GradeDisplay):
    student_name: str


# Attendance Endpoint
@router.get(
    "/attendance/courses/{course_id}/date/{attendance_date}", 
    response_model=List[AttendanceDisplayWithStudentName], 
    dependencies=[Depends(security.require_permission(["hod", "superuser"]))]
)
def view_class_attendance(
    course_id: int, 
    attendance_date: date,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
#  attendance code
    logging.info(f"User '{current_user.email}' is viewing attendance for course ID {course_id} on {attendance_date}.")
    attendance_records_with_names = db.query(
        models.Attendance, models.User.name.label("student_name")
    ).join(
        models.User, models.Attendance.student_id == models.User.id
    ).filter(
        models.Attendance.course_id == course_id,
        models.Attendance.date == attendance_date
    ).all()
    if not attendance_records_with_names:
        raise HTTPException(status_code=404, detail="No attendance records found.")
    results = []
    for attendance_record, student_name in attendance_records_with_names:
        results.append(AttendanceDisplayWithStudentName(
            id=attendance_record.id,
            date=attendance_record.date,
            status=attendance_record.status,
            student_id=attendance_record.student_id,
            course_id=attendance_record.course_id,
            student_name=student_name
        ))
    return results

# GRADES ENDPOINT 
@router.get(
    "/grades/courses/{course_id}", 
    response_model=List[GradeDisplayWithStudentName], 
    dependencies=[Depends(security.require_permission(["teacher", "hod", "superuser"]))]
)
def view_all_grades_for_course(
    course_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    """
    Endpoint for authorized staff to view all grades for a specific course,
    now including student names.
    """
    logging.info(f"User '{current_user.email}' is viewing all grades for course ID {course_id}.")
    
    grades_with_names = db.query(
        models.Grade,
        models.User.name.label("student_name")
    ).join(models.User, models.Grade.student_id == models.User.id).filter(
        models.Grade.course_id == course_id
    ).all()

    if not grades_with_names:
        raise HTTPException(status_code=404, detail="No grades found for this course.")
        
    results = []
    for grade_record, student_name in grades_with_names:
        results.append(GradeDisplayWithStudentName(
            id=grade_record.id,
            assignment_name=grade_record.assignment_name,
            score=grade_record.score,
            comments=grade_record.comments,
            student_id=grade_record.student_id,
            course_id=grade_record.course_id,
            student_name=student_name
        ))
    return results