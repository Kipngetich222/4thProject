import axios from "axios";

const API_URL = "http://localhost:5000/api";
// axios.defaults.baseURL = API_URL;

export const login = (email, password) =>
  axios.post(
    `${API_URL}/login`,
    { email, password },
    {
      withCredentials: true, // Essential for cookies
    }
  );
export const signup = (name, email, password, role) =>
  axios.post(`${API_URL}/auth/signup`, { name, email, password, role });
export const getUsers = () => axios.get(`/admin/users`);
export const deleteUser = (id) => axios.delete(`${API_URL}/admin/users/${id}`);
export const getGrades = () => axios.get("/teacher/grades");
