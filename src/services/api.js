import axios from "axios";

const API_URL = "http://localhost:5173/api";

// Authentication
export const login = (email, password) =>
  axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });

export const signup = (name, email, password, role) =>
  axios.post(`${API_URL}/auth/signup`, { name, email, password, role }, { withCredentials: true });

// User Management
export const getUsers = () => axios.get(`${API_URL}/admin/users`, { withCredentials: true });
export const deleteUser = (id) => axios.delete(`${API_URL}/admin/users/${id}`, { withCredentials: true });






