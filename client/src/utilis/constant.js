const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const USER_API_END_POINT = `${BASE}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE}/api/v1/company`;
export const CHATBOT_API_END_POINT = `${BASE}/api/v1/chatbot`;
export const BOOKMARK_API_END_POINT = "https://jobseeker-jqt2.onrender.com/api/v1/bookmark";
