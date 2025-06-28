# crud/interview.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from app.models.interview import InterviewDetails
from app.schemas.interview import InterviewDetailsCreate, InterviewDetailsUpdate
from typing import List, Optional


async def create_interview(session: AsyncSession, interview: InterviewDetailsCreate) -> InterviewDetails:
    db_interview = InterviewDetails(**interview.dict())
    session.add(db_interview)
    await session.commit()
    await session.refresh(db_interview)
    return db_interview


async def get_interview(session: AsyncSession, applicant_id: int, job_id: int) -> Optional[InterviewDetails]:
    result = await session.execute(
        select(InterviewDetails).where(
            and_(
                InterviewDetails.applicant_id == applicant_id,
                InterviewDetails.job_id == job_id
            )
        )
    )
    return result.scalar_one_or_none()


async def get_all_interviews(session: AsyncSession) -> List[InterviewDetails]:
    result = await session.execute(select(InterviewDetails))
    return list(result.scalars().all())


async def update_interview(
    session: AsyncSession,
    applicant_id: int,
    job_id: int,
    updates: InterviewDetailsUpdate
) -> Optional[InterviewDetails]:
    db_interview = await get_interview(session, applicant_id, job_id)
    if not db_interview:
        return None

    for key, value in updates.dict(exclude_unset=True).items():
        setattr(db_interview, key, value)

    await session.commit()
    await session.refresh(db_interview)
    return db_interview


async def delete_interview(session: AsyncSession, applicant_id: int, job_id: int) -> bool:
    db_interview = await get_interview(session, applicant_id, job_id)
    if not db_interview:
        return False
    await session.delete(db_interview)
    await session.commit()
    return True

