from app.algorithms.hashing import TagMatcher
from app.services.tag_hash_table import get_tag_hash_table
from app.crud import tags as tag_crud
from app.crud import jobs as jobs_crud
from app.crud import applicant as applicant_crud  # Use your existing applicant CRUD

class MatchingService:
    @staticmethod
    async def calculate_job_match_score(db, applicant_id: int, job_id: int) -> float:
        """
        Calculate match score using the formula:
        Match Score = (|A ∩ J| / |J|) * 70% + (|A ∩ J| / |A|) * 30%
        """
        try:
            # Get applicant tags (A) - from real database
            applicant_tags = await applicant_crud.get_applicant_tags(db, applicant_id)
            applicant_tag_names = [tag.tag_name for tag in applicant_tags]
            
            # Get job tags (J) - from real database
            job_tags = await jobs_crud.get_job_tags(db, job_id)
            job_tag_names = [tag.tag_name for tag in job_tags]
            
            # Edge case: No tags
            if not applicant_tag_names or not job_tag_names:
                return 0
            
            # Calculate match score using TagMatcher with hash table
            matcher = TagMatcher(applicant_tag_names, job_tag_names)
            match_score = matcher.calculate_score()
            
            return match_score
            
        except Exception as e:
            print(f"Error calculating match score: {e}")
            return 0
    
    @staticmethod
    async def get_jobs_with_match_scores(db, applicant_id: int):
        """Get all jobs with calculated match scores for an applicant"""
        try:
            # Get real jobs from database
            jobs = await jobs_crud.get_all_jobs(db)
            jobs_with_scores = []
            
            for job in jobs:
                # Calculate match score for each job
                match_score = await MatchingService.calculate_job_match_score(
                    db, applicant_id, job.job_id
                )
                
                job_data = {
                    "job_id": job.job_id,
                    "job_title": job.job_title,
                    "company_name": job.company.company_name if hasattr(job, 'company') and job.company else "Unknown",
                    "location": getattr(job, 'location', "Manila"),
                    "employment_type": job.work_type.value if hasattr(job, 'work_type') and job.work_type else "fulltime",
                    "work_setting": job.setting.value if hasattr(job, 'setting') and job.setting else "remote", 
                    "description": job.description,
                    "salary_min": float(job.salary_min) if job.salary_min else 0,
                    "salary_max": float(job.salary_max) if job.salary_max else 0,
                    "match_score": round(match_score)
                }
                
                jobs_with_scores.append(job_data)
            
            return jobs_with_scores
            
        except Exception as e:
            print(f"Error getting jobs with match scores: {e}")
            return []

    @staticmethod
    async def get_applicants_with_match_scores(db, job_id: int):
        """Get all applicants with calculated match scores for a job (Employer side)"""
        try:
            # Get real applicants who applied to this job from database
            applicants = await applicant_crud.get_applicants_for_job(db, job_id)
            applicants_with_scores = []
            
            for applicant in applicants:
                # Calculate match score for each applicant
                match_score = await MatchingService.calculate_job_match_score(
                    db, applicant.applicant_id, job_id
                )
                
                # Get applicant tags/skills from database
                applicant_tags = await applicant_crud.get_applicant_tags(db, applicant.applicant_id)
                skills = [tag.tag_name for tag in applicant_tags]
                
                applicant_data = {
                    "applicant_id": applicant.applicant_id,
                    "first_name": getattr(applicant, 'first_name', 'Unknown'),
                    "last_name": getattr(applicant, 'last_name', 'User'),
                    "email": getattr(applicant, 'email', 'unknown@email.com'),
                    "skills": skills,
                    "experience": getattr(applicant, 'years_of_experience', 0),
                    "match_score": round(match_score)
                }
                
                applicants_with_scores.append(applicant_data)
            
            return applicants_with_scores
            
        except Exception as e:
            print(f"Error getting applicants with match scores: {e}")
            return []