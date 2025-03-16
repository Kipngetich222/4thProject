import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Authentication
export const login = (email, password) =>
  axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });

export const signup = (name, email, password, role) =>
  axios.post(`${API_URL}/auth/signup`, { name, email, password, role }, { withCredentials: true });

// User Management
export const getUsers = () => axios.get(`${API_URL}/admin/users`, { withCredentials: true });
export const deleteUser = (id) => axios.delete(`${API_URL}/admin/users/${id}`, { withCredentials: true });

// Course Management
export const createCourse = (courseName, description) =>
  axios.post(`${API_URL}/course/create`, { courseName, description }, { withCredentials: true });

export const fetchCourses = () =>
  axios.get(`${API_URL}/course/my-courses`, { withCredentials: true });

export const updateCourse = (courseId, courseName, description) =>
  axios.put(`${API_URL}/course/update/${courseId}`, { courseName, description }, { withCredentials: true });

export const deleteCourse = (courseId) =>
  axios.delete(`${API_URL}/course/delete/${courseId}`, { withCredentials: true });

// Assignment Management
export const createAssignment = (title, description, dueDate, courseId) =>
  axios.post(
    `${API_URL}/assignment/create`,
    { title, description, dueDate, courseId },
    { withCredentials: true }
  );

export const fetchAssignmentsByCourse = (courseId) =>
  axios.get(`${API_URL}/assignment/course/${courseId}`, { withCredentials: true });

export const updateAssignment = (assignmentId, title, description, dueDate) =>
  axios.put(
    `${API_URL}/assignment/update/${assignmentId}`,
    { title, description, dueDate },
    { withCredentials: true }
  );

export const deleteAssignment = (assignmentId) =>
  axios.delete(`${API_URL}/assignment/delete/${assignmentId}`, { withCredentials: true });