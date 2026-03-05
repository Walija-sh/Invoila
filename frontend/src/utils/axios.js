// to create single azios instance

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Vite env variable
//   withCredentials: true, // if you use cookies for auth
});

export default API;