// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext";
// import { toast } from "react-hot-toast";

// const AssignmentManagement = () => {
//   const [assignments, setAssignments] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [courseId, setCourseId] = useState("");
//   const [courses, setCourses] = useState([]);
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const { data } = await axios.get("/api/course/my-courses", { withCredentials: true });
//       setCourses(data.courses);
//     } catch (error) {
//       toast.error("Failed to fetch courses");
//     }
//   };

//   const fetchAssignments = async (courseId) => {
//     try {
//       const { data } = await axios.get(`/api/assignment/course/${courseId}`, { withCredentials: true });
//       setAssignments(data.assignments);
//     } catch (error) {
//       toast.error("Failed to fetch assignments");
//     }
//   };

//   const handleCreateAssignment = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(
//         "/api/assignment/create",
//         { title, description, dueDate, courseId },
//         { withCredentials: true }
//       );
//       toast.success("Assignment created successfully");
//       setAssignments([...assignments, data.assignment]);
//       setTitle("");
//       setDescription("");
//       setDueDate("");
//     } catch (error) {
//       toast.error("Failed to create assignment");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Assignment Management</h1>
//       <form onSubmit={handleCreateAssignment} className="mb-6">
//         <div className="mb-4">
//           <label className="block text-gray-700">Course</label>
//           <select
//             value={courseId}
//             onChange={(e) => setCourseId(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg"
//             required
//           >
//             <option value="">Select a course</option>
//             {courses.map((course) => (
//               <option key={course._id} value={course._id}>
//                 {course.courseName}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Due Date</label>
//           <input
//             type="date"
//             value={dueDate}
//             onChange={(e) => setDueDate(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg"
//             required
//           />
//         </div>
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
//           Create Assignment
//         </button>
//       </form>

//       <div>
//         <h2 className="text-xl font-bold mb-4">Assignments</h2>
//         {assignments.length === 0 ? (
//           <p>No assignments found.</p>
//         ) : (
//           assignments.map((assignment) => (
//             <div key={assignment._id} className="bg-gray-100 p-4 rounded-lg mb-4">
//               <h3 className="font-bold">{assignment.title}</h3>
//               <p>{assignment.description}</p>
//               <p>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssignmentManagement;

import React, { useState, useEffect } from "react";
import { createAssignment, fetchAssignmentsByCourse, fetchCourses } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();

  // Fetch the teacher's courses when the component loads
  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  const fetchTeacherCourses = async () => {
    try {
      const { data } = await fetchCourses();
      setCourses(data.courses);
    } catch (error) {
      toast.error("Failed to fetch courses");
    }
  };

  // Fetch assignments for the selected course
  const fetchAssignments = async (courseId) => {
    try {
      const { data } = await fetchAssignmentsByCourse(courseId);
      setAssignments(data.assignments);
    } catch (error) {
      toast.error("Failed to fetch assignments");
    }
  };

  // Handle course selection change
  const handleCourseChange = (e) => {
    const selectedCourseId = e.target.value;
    setCourseId(selectedCourseId);
    if (selectedCourseId) {
      fetchAssignments(selectedCourseId); // Fetch assignments for the selected course
    } else {
      setAssignments([]); // Clear assignments if no course is selected
    }
  };

  // Handle assignment creation
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!courseId) {
      toast.error("Please select a course");
      return;
    }
    try {
      const { data } = await createAssignment(title, description, dueDate, courseId);
      toast.success("Assignment created successfully");
      setAssignments([...assignments, data.assignment]); // Add the new assignment to the list
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (error) {
      toast.error("Failed to create assignment");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assignment Management</h1>
      <form onSubmit={handleCreateAssignment} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Course</label>
          <select
            value={courseId}
            onChange={handleCourseChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
        <div className="mb-4">
          <label className="block text-gray-700">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Create Assignment
        </button>
      </form>

      <div>
        <h2 className="text-xl font-bold mb-4">Assignments</h2>
        {assignments.length === 0 ? (
          <p>No assignments found.</p>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment._id} className="bg-gray-100 p-4 rounded-lg mb-4">
              <h3 className="font-bold">{assignment.title}</h3>
              <p>{assignment.description}</p>
              <p>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentManagement;