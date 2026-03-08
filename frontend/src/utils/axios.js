// to create single azios instance

import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Vite env variable
//   withCredentials: true, // if you use cookies for auth
});
// Add request interceptor
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage (or you can use context later)
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export default API;