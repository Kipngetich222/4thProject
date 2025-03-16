import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/course/my-courses", { withCredentials: true });
      setCourses(data.courses);
    } catch (error) {
      toast.error("Failed to fetch courses");
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/course/create",
        { courseName, description },
        { withCredentials: true }
      );
      toast.success("Course created successfully");
      setCourses([...courses, data.course]);
      setCourseName("");
      setDescription("");
    } catch (error) {
      toast.error("Failed to create course");
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Course Management</h1>
      <form onSubmit={handleCreateCourse} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Course Name</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Create Course
        </button>
      </form>

      <div>
        <h2 className="text-xl font-bold mb-4">My Courses</h2>
        {isLoading ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="bg-gray-100 p-4 rounded-lg mb-4">
              <h3 className="font-bold">{course.courseName}</h3>
              <p>{course.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseManagement;