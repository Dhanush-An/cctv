const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helpful for debugging data mismatch issues across environments
if (import.meta.env.DEV) {
    console.log(`[CCTV Platform] Using API Base URL: ${API_BASE_URL}`);
}

export const API_URLS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        VERIFY: `${API_BASE_URL}/api/auth/verify`,
    },
    DASHBOARD: `${API_BASE_URL}/api/dashboard`,
    // Add other endpoints here as they are implemented
};

export default API_BASE_URL;
