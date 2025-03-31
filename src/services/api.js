// import axios from "axios";

// const API_URL = "http://localhost:5000/api";
// // axios.defaults.baseURL = API_URL;

// export const login = (email, password) =>
//   axios.post(
//     `${API_URL}/login`,
//     { email, password },
//     {
//       withCredentials: true, // Essential for cookies
//     }
//   );
// export const signup = (name, email, password, role) =>
//   axios.post(`${API_URL}/auth/signup`, { name, email, password, role });
// export const getUsers = () => axios.get(`/admin/users`);
// export const deleteUser = (id) => axios.delete(`${API_URL}/admin/users/${id}`);
// export const getGrades = () => axios.get("/teacher/grades");


import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
// api.js - Updated interceptors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = (email, password) =>
  api.post("/login", { email, password });

export const signup = (name, email, password, role) =>
  api.post("/auth/signup", { name, email, password, role });

export const getUsers = () => api.get("/admin/users");
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getGrades = () => api.get("/teacher/grades");

export default api;