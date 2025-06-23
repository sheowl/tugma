const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

class AuthService {
    // Company login
    async companyLogin(company_email, password) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/v1/auth/company/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ company_email, password }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                // Store tokens in localStorage
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("user_type", data.user_type);
                localStorage.setItem("company_id", data.company_id);
                return { success: true, data };
            } else {
                return { success: false, error: data.detail };
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: "Network error. Please check your connection.",
            };
        }
    }

    // Company signup
    async companySignup(company_email, password, company_name) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/v1/auth/company/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ company_email, password, company_name }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("user_type", data.user_type);
                localStorage.setItem("company_id", data.company_id);
                return { success: true, data };
            } else {
                return { success: false, error: data.detail };
            }
        } catch (error) {
            console.error("Signup error:", error);
            return {
                success: false,
                error: "Network error. Please check your connection.",
            };
        }
    }

    // Applicant login
    async applicantLogin(email, password) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/v1/auth/applicant/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("user_type", data.user_type);
                localStorage.setItem("applicant_id", data.applicant_id);
                return { success: true, data };
            } else {
                return { success: false, error: data.detail };
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: "Network error. Please check your connection.",
            };
        }
    }

    // Applicant signup
    async applicantSignup(email, password, userData) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/v1/auth/applicant/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password, ...userData }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("user_type", data.user_type);
                localStorage.setItem("applicant_id", data.applicant_id);
                return { success: true, data };
            } else {
                return { success: false, error: data.detail };
            }
        } catch (error) {
            console.error("Signup error:", error);
            return {
                success: false,
                error: "Network error. Please check your connection.",
            };
        }
    }

    logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        localStorage.removeItem("user_type");
        localStorage.removeItem("company_id");
        localStorage.removeItem("applicant_id");
    }

    getToken() {
        return localStorage.getItem("access_token");
    }

    getCurrentUser() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }

    getUserType() {
        return localStorage.getItem("user_type");
    }

    isEmployer() {
        return this.getUserType() === "employer";
    }

    isApplicant() {
        return this.getUserType() === "applicant";
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    // Helper method to make authenticated API calls
    async makeAuthenticatedRequest(url, options = {}) {
        let token = this.getToken();

        if (!token) {
            throw new Error("No authentication token available");
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`, // ✅ FIXED: Added backticks
                "Content-Type": "application/json",
            },
        });

        // If unauthorized, try to refresh token
        if (response.status === 401) {
            // For now, just logout (you can implement refresh later)
            this.logout();
            throw new Error("Session expired. Please login again.");
        }

        return response;
    }

    // Company-specific API calls
    async getCompanyProfile() {
        const response = await this.makeAuthenticatedRequest(
            `${API_BASE_URL}/v1/company/me/profile`,
            { method: "GET" }
        );
        return response.json();
    }

    async updateCompanyProfile(data) {
        const response = await this.makeAuthenticatedRequest(
            `${API_BASE_URL}/v1/company/me/profile`,
            {
                method: "PUT",
                body: JSON.stringify(data),
            }
        );
        return response.json();
    }

    async completeOnboarding(data) {
        const response = await this.makeAuthenticatedRequest(
            `${API_BASE_URL}/v1/company/onboarding`,
            {
                method: "PUT",
                body: JSON.stringify(data),
            }
        );
        return response.json();
    }

    async getOnboardingStatus() {
        const response = await this.makeAuthenticatedRequest(
            `${API_BASE_URL}/v1/company/onboarding-status`,
            { method: "GET" }
        );
        return response.json();
    }
}

export default new AuthService();