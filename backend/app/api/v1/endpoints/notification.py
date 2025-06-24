# app/api/v1/endpoints/notification.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.notification import NotificationCreate, NotificationOut
from app.crud import notification as crud
from app.core.database import get_db

router = APIRouter(prefix="/notifications", tags=["notifications"])

# Create a notification
@router.post("/", response_model=NotificationOut)
async def create_notification(notification: NotificationCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_notification(db, notification)

# Get a notification by ID
@router.get("/{notification_id}", response_model=NotificationOut)
async def get_notification(notification_id: int, db: AsyncSession = Depends(get_db)):
    notif = await crud.get_notification(db, notification_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notif

# Get all notifications (admin or debug purpose)
@router.get("/", response_model=List[NotificationOut])
async def get_all_notifications(db: AsyncSession = Depends(get_db)):
    return await crud.get_all_notifications(db)

# Get all notifications for a specific applicant
@router.get("/applicant/{applicant_id}", response_model=List[NotificationOut])
async def get_notifications_for_applicant(applicant_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_notifications_for_applicant(db, applicant_id)

# Delete a notification
@router.delete("/{notification_id}", status_code=204)
async def delete_notification(notification_id: int, db: AsyncSession = Depends(get_db)):
    deleted = await crud.delete_notification(db, notification_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Notification not found")

