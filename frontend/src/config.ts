const API_BASE_URL = "https://cctv-caro.onrender.com";

export const API_URLS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        VERIFY: `${API_BASE_URL}/api/auth/verify`,
    },
    DASHBOARD: `${API_BASE_URL}/api/dashboard`,
    // Add other endpoints here as they are implemented
};

export default API_BASE_URL;
