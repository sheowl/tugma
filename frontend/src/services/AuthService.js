import { supabase } from "../services/supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

class AuthService {
    // UPDATED: Simplified company login using Supabase + verification
    async companyLogin(company_email, password) {
        try {
            // Step 1: Sign in with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: company_email,
                password: password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            // Step 2: Verify user is a company using the token we just got
            const verifyResponse = await fetch(`${API_BASE_URL}/v1/auth/verify-company`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${data.session.access_token}`
                },
            });

            if (verifyResponse.ok) {
                const companyData = await verifyResponse.json();
                return { 
                    success: true, 
                    data: { 
                        user: data.user, 
                        session: data.session,
                        ...companyData 
                    } 
                };
            } else {
                // Not a company, sign out
                await supabase.auth.signOut();
                return { success: false, error: "Not authorized as company" };
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: "Network error. Please check your connection.",
            };
        }
    }

    // UPDATED: Simplified applicant login using Supabase + verification
    async applicantLogin(email, password) {
        try {
            // Step 1: Sign in with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            // Step 2: Verify user is an applicant using the token we just got
            const verifyResponse = await fetch(`${API_BASE_URL}/v1/auth/verify-applicant`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${data.session.access_token}`
                },
            });

            if (verifyResponse.ok) {
                const applicantData = await verifyResponse.json();
                return { 
                    success: true, 
                    data: { 
                        user: data.user, 
                        session: data.session,
                        ...applicantData 
                    } 
                };
            } else {
                // Not an applicant, sign out
                await supabase.auth.signOut();
                return { success: false, error: "Not authorized as applicant" };
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: "Network error. Please check your connection.",
            };
        }
    }

    // Keep your existing signup methods as they are
    async companySignup(company_email, password, company_name) {
        try {
            // Use Supabase auth for signup
            const { data, error } = await supabase.auth.signUp({
                email: company_email,
                password: password,
                options: {
                    data: {
                        user_type: 'employer',
                        company_name: company_name
                    }
                }
            });

            if (error) {
                return { success: false, error: error.message };
            }

            // Create company record in your backend
            if (data.session) {
                const response = await fetch(`${API_BASE_URL}/v1/auth/company/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${data.session.access_token}`
                    },
                    body: JSON.stringify({ company_name }),
                });

                if (response.ok) {
                    const companyData = await response.json();
                    return { success: true, data: { user: data.user, ...companyData } };
                } else {
                    return { success: false, error: "Failed to create company profile" };
                }
            }

            return { success: true, data };
        } catch (error) {
            console.error("Signup error:", error);
            return {
                success: false,
                error: "Network error. Please check your connection.",
            };
        }
    }

    async applicantSignup(email, password, userData) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        user_type: 'applicant',
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        ...userData
                    }
                }
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, data };
        } catch (error) {
            console.error("Signup error:", error);
            return {
                success: false,
                error: "Network error. Please check your connection.",
            };
        }
    }

    // FIXED: Use Supabase logout
    async logout() {
        try {
            await supabase.auth.signOut();
            // Still clear localStorage for any remaining data
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            localStorage.removeItem("user_type");
            localStorage.removeItem("company_id");
            localStorage.removeItem("applicant_id");
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    // Use Supabase tokens for authenticated requests
    async makeAuthenticatedRequest(url, options = {}) {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
            throw new Error("No authentication token available");
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 401) {
            await this.logout();
            throw new Error("Session expired. Please login again.");
        }

        return response;
    }

    async getToken() {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token;
    }

    async isAuthenticated() {
        const { data: { session } } = await supabase.auth.getSession();
        return !!session?.access_token;
    }
}

export default new AuthService();