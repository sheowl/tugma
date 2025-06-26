import AuthService from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

class CompanyService {
    // Onboarding operations
    async getOnboardingStatus() {
        const response = await AuthService.makeAuthenticatedRequest(
            `${API_BASE_URL}/v1/companies/onboarding-status`,
            { method: "GET" }
        );
        return response.json();
    }

    async completeOnboarding(data) {
        const response = await AuthService.makeAuthenticatedRequest(
            `${API_BASE_URL}/v1/companies/onboarding`,
            {
                method: "PUT",
                body: JSON.stringify(data),
            }
        );
        return response.json();
    }

    // Dashboard operations
    async getDashboardStats() {
        const response = await AuthService.makeAuthenticatedRequest(
            `${API_BASE_URL}/v1/companies/dashboard/stats`,
            { method: "GET" }
        );
        return response.json();
    }

    async getRecentApplicants(limit = 3) {
        const response = await AuthService.makeAuthenticatedRequest(
            `${API_BASE_URL}/v1/companies/dashboard/recent-applicants?limit=${limit}`,
            { method: "GET" }
        );
        return response.json();
    }

    // Profile operations - Fix the URL
    async getProfile() {
        const response = await AuthService.makeAuthenticatedRequest(
            `${API_BASE_URL}/v1/companies/me/profile`,  // ✅ Change 'company' to 'companies'
            { method: "GET" }
        );
        return response.json();
    }

    async updateProfile(data) {
        const response = await AuthService.makeAuthenticatedRequest(
            `${API_BASE_URL}/v1/companies/me/profile`,  // ✅ Fixed: changed from company to companies
            {
                method: "PUT",
                body: JSON.stringify(data),
            }
        );
        return response.json();
    }

    // Job operations
    async getJobs() {
        const response = await AuthService.makeAuthenticatedRequest(
            `${API_BASE_URL}/v1/jobs/company/jobs`,
            { method: "GET" }
        );
        return response.json();
    }

    async createJob(jobData) {
        const response = await AuthService.makeAuthenticatedRequest(
            `${API_BASE_URL}/v1/jobs/jobs`,
            {
                method: "POST",
                body: JSON.stringify(jobData),
            }
        );
        return response.json();
    }

    // Applicant operations
    async getApplicants(jobId = null) {
        const url = jobId 
            ? `${API_BASE_URL}/v1/applications/job/${jobId}`
            : `${API_BASE_URL}/v1/applications/company/applications`;
            
        const response = await AuthService.makeAuthenticatedRequest(url, { method: "GET" });
        return response.json();
    }
}

export default new CompanyService();