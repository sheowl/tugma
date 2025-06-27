from app.algorithms.hashing import TagMatcher, TagHashTable
from app.crud import tags as tag_crud
from app.crud import jobs as jobs_crud
from app.crud import applicant as applicant_crud
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud import jobs as jobs_crud


class MatchingService:
    @staticmethod
    async def calculate_job_match_score_with_details(db: AsyncSession, applicant_id: int, job_id: int) -> dict:
        """
        Calculate match score using the formula:
        Match Score = (|A ∩ J| / |J|) * 70% + (|A ∩ J| / |A|) * 30%
        """
        try:
            # Get applicant tags (A) and job tags (J)
            applicant_tags_db = await applicant_crud.get_applicant_tags(db, applicant_id)
            job_tags_db = await jobs_crud.get_job_tags_with_names(db, job_id)
            
            # Extract tag names (same as before)
            applicant_tag_names = []
            for tag in applicant_tags_db:
                if hasattr(tag, 'tag_name'):
                    applicant_tag_names.append(tag.tag_name)
                elif isinstance(tag, dict) and 'tag_name' in tag:
                    applicant_tag_names.append(tag['tag_name'])
        
            job_tag_names = []
            for tag in job_tags_db:
                if hasattr(tag, 'tag_name'):
                    job_tag_names.append(tag.tag_name)
                elif isinstance(tag, dict) and 'tag_name' in tag:
                    job_tag_names.append(tag['tag_name'])
        
            print(f"🔍 DEBUG: Applicant tags: {applicant_tag_names}")
            print(f"🔍 DEBUG: Job tags: {job_tag_names}")
        
            # Edge case: No tags
            if not applicant_tag_names or not job_tag_names:
                return {
                    "match_score": 0,
                    "matched_tags": [],
                    "unmatched_job_tags": job_tag_names,
                    "unmatched_applicant_tags": applicant_tag_names,
                    "total_job_tags": len(job_tag_names),
                    "total_applicant_tags": len(applicant_tag_names),
                    "intersection_count": 0,
                    "formula_breakdown": {
                        "job_coverage": 0,
                        "applicant_coverage": 0
                    }
                }
        
            # 🔥 CORE ALGORITHM: Use TagMatcher with FNV-1a hash table
            print(f"🔍 DEBUG: Creating TagMatcher with FNV-1a hash table...")
            matcher = TagMatcher(applicant_tag_names, job_tag_names)
        
            # Calculate match score using your hash table algorithm
            match_score = matcher.calculate_score()
            print(f"🔍 DEBUG: Hash-based match score: {match_score}")
        
            # 🔥 ALGORITHM DEMONSTRATION: Find intersections using hash table
            print(f"🔍 DEBUG: Finding intersections using FNV-1a hash table...")
            matched_tags = []
            unmatched_job_tags = []
            unmatched_applicant_tags = []
        
            # Use hash table to find matched tags (intersection A ∩ J)
            for applicant_tag in applicant_tag_names:
                hash_value = matcher.job_table._hash(applicant_tag)  # Get FNV-1a hash
                print(f"🔍 DEBUG: Checking '{applicant_tag}' -> hash: {hash_value}")
            
                if matcher.job_table.contains(applicant_tag):  # O(1) lookup using FNV-1a
                    matched_tags.append(applicant_tag)
                    print(f"✅ DEBUG: MATCH FOUND: '{applicant_tag}' exists in job tags")
                else:
                    unmatched_applicant_tags.append(applicant_tag)
                    print(f"❌ DEBUG: NO MATCH: '{applicant_tag}' not in job tags")
        
            # Find job tags that aren't matched
            for job_tag in job_tag_names:
                if job_tag not in matched_tags:
                    unmatched_job_tags.append(job_tag)
        
            print(f"🔍 DEBUG: Intersection using hash table: {matched_tags}")
            print(f"🔍 DEBUG: Total intersections: {len(matched_tags)}")
        
            return {
                "match_score": round(match_score),
                "matched_tags": matched_tags,
                "unmatched_job_tags": unmatched_job_tags, 
                "unmatched_applicant_tags": unmatched_applicant_tags,
                "total_job_tags": len(job_tag_names),
                "total_applicant_tags": len(applicant_tag_names),
                "intersection_count": len(matched_tags),
                "formula_breakdown": {
                    "job_coverage": round((len(matched_tags) / len(job_tag_names)) * 100, 1) if job_tag_names else 0,
                    "applicant_coverage": round((len(matched_tags) / len(applicant_tag_names)) * 100, 1) if applicant_tag_names else 0
                },
                # 🔥 ALGORITHM EVIDENCE: Include hash details for academic demonstration
                "algorithm_details": {
                    "hashing_algorithm": "FNV-1a",
                    "hash_table_size": matcher.job_table.size,
                    "tag_hash_samples": {
                        tag: matcher.job_table._hash(tag) for tag in job_tag_names[:3]  # Show first 3 hashes
                    }
                }
            }
        
        except Exception as e:
            print(f"❌ Error calculating detailed match score: {e}")
            import traceback
            traceback.print_exc()
            return {
                "match_score": 0,
                "matched_tags": [],
                "unmatched_job_tags": [],
                "unmatched_applicant_tags": [],
                "total_job_tags": 0,
                "total_applicant_tags": 0,
                "intersection_count": 0,
                "formula_breakdown": {"job_coverage": 0, "applicant_coverage": 0},
                "algorithm_details": {"hashing_algorithm": "FNV-1a", "error": str(e)}
            }

    @staticmethod
    async def get_jobs_with_detailed_match_scores(db: AsyncSession, applicant_id: int):
        """Get all jobs with detailed match scores and tag breakdowns"""
        try:
            print(f"🔍 DEBUG: Starting job matching for applicant {applicant_id}")
                        
            # Get all jobs from database
            jobs = await jobs_crud.get_all_active_jobs(db)  # Now this function exists
            print(f"🔍 DEBUG: Found {len(jobs)} total jobs in database")
            
            if not jobs:
                print("❌ DEBUG: No jobs found in database!")
                # Let's check if there are ANY jobs at all
                all_jobs = await jobs_crud.get_all_jobs(db)  # This might not exist yet
                print(f"🔍 DEBUG: Total jobs in database (including inactive): {len(all_jobs) if all_jobs else 'Unknown'}")
                return []
            
            jobs_with_detailed_scores = []
            
            for job in jobs:
                print(f"🔍 DEBUG: Processing job {job.job_id}: {job.job_title}")
                
                try:
                    # Calculate detailed match score for each job
                    match_details = await MatchingService.calculate_job_match_score_with_details(
                        db, applicant_id, job.job_id
                    )
                    
                    print(f"🔍 DEBUG: Match score for job {job.job_id}: {match_details.get('match_score', 0)}")
                    
                    # Get company info
                    company_info = await jobs_crud.get_job_company_info(db, job.job_id)
                    company_name = company_info.company_name if company_info else "Unknown Company"
                    company_location = company_info.location if company_info else "Unknown Location"
                    
                    print(f"🔍 DEBUG: Company info for job {job.job_id}: {company_name}")
                    
                    # Get job tags
                    job_tags_with_names = await jobs_crud.get_job_tags_with_names(db, job.job_id)
                    job_tag_ids = [tag.tag_id for tag in job_tags_with_names]
                    print(f"🔍 DEBUG: Job {job.job_id} has {len(job_tag_ids)} tags: {job_tag_ids}")
                    
                    job_data = {
                        "job_id": job.job_id,
                        "job_title": job.job_title,
                        "company_name": company_name,
                        "company_location": company_location,
                        "location": company_location,
                        "description": job.description,
                        "salary_min": float(job.salary_min) if job.salary_min else 0,
                        "salary_max": float(job.salary_max) if job.salary_max else 0,
                        "salary_frequency": "monthly",
                        "setting": job.setting,
                        "work_type": job.work_type,
                        "position_count": job.position_count or 1,
                        "required_category_id": job.required_category_id,
                        "required_proficiency": job.required_proficiency,
                        "created_at": job.created_at,
                        
                        # Job tags
                        "job_tags": job_tag_ids,
                        
                        # Match score and detailed breakdown
                        "match_score": match_details["match_score"],
                        "matched_tags": match_details["matched_tags"],
                        "unmatched_job_tags": match_details["unmatched_job_tags"],
                        "unmatched_applicant_tags": match_details["unmatched_applicant_tags"],
                        "formula_breakdown": match_details["formula_breakdown"],
                        "intersection_count": match_details["intersection_count"],
                        "total_job_tags": match_details["total_job_tags"],
                        "total_applicant_tags": match_details["total_applicant_tags"],
                    }
                    
                    jobs_with_detailed_scores.append(job_data)
                    print(f"✅ DEBUG: Successfully processed job {job.job_id}")
                    
                except Exception as job_error:
                    print(f"❌ DEBUG: Error processing job {job.job_id}: {job_error}")
                    import traceback
                    traceback.print_exc()
                    continue  # Skip this job but continue with others
        
            print(f"🔍 DEBUG: Final jobs with scores: {len(jobs_with_detailed_scores)}")
            return jobs_with_detailed_scores
            
        except Exception as e:
            print(f"❌ ERROR in get_jobs_with_detailed_match_scores: {e}")
            import traceback
            traceback.print_exc()
            return []
