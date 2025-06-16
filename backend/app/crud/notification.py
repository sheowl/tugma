# crud/notification.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate
from typing import List, Optional


async def create_notification(session: AsyncSession, notification: NotificationCreate) -> Notification:
    db_notification = Notification(**notification.dict())
    session.add(db_notification)
    await session.commit()
    await session.refresh(db_notification)
    return db_notification


async def get_notification(session: AsyncSession, notification_id: int) -> Optional[Notification]:
    result = await session.execute(
        select(Notification).where(Notification.notification_id == notification_id)
    )
    return result.scalar_one_or_none()


async def get_all_notifications(session: AsyncSession) -> List[Notification]:
    result = await session.execute(select(Notification))
    return list(result.scalars().all())


async def get_notifications_for_applicant(session: AsyncSession, applicant_id: int) -> List[Notification]:
    result = await session.execute(
        select(Notification).where(Notification.recipient_applicant_id == applicant_id)
    )
    return list(result.scalars().all())

async def delete_notification(session: AsyncSession, notification_id: int) -> bool:
    db_notification = await get_notification(session, notification_id)
    if not db_notification:
        return False
    await session.delete(db_notification)
    await session.commit()
    return True

