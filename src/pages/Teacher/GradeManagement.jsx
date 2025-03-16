import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const GradeManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [grades, setGrades] = useState([]);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data } = await axios.get("/api/assignment/my-courses", { withCredentials: true });
      setAssignments(data.assignments);
    } catch (error) {
      toast.error("Failed to fetch assignments");
    }
  };

  const fetchGrades = async (assignmentId) => {
    try {
      const { data } = await axios.get(`/api/grade/assignment/${assignmentId}`, { withCredentials: true });
      setGrades(data.grades);
    } catch (error) {
      toast.error("Failed to fetch grades");
    }
  };

  const handleGradeAssignment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/grade/create",
        { assignmentId: selectedAssignment, studentId: user._id, grade, feedback },
        { withCredentials: true }
      );
      toast.success("Grade submitted successfully");
      setGrades([...grades, data.grade]);
      setGrade("");
      setFeedback("");
    } catch (error) {
      toast.error("Failed to submit grade");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Grade Management</h1>
      <div className="mb-6">
        <label className="block text-gray-700">Select Assignment</label>
        <select
          value={selectedAssignment || ""}
          onChange={(e) => {
            setSelectedAssignment(e.target.value);
            fetchGrades(e.target.value);
          }}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select an assignment</option>
          {assignments.map((assignment) => (
            <option key={assignment._id} value={assignment._id}>
              {assignment.title}
            </option>
          ))}
        </select>
      </div>

      {selectedAssignment && (
        <div>
          <h2 className="text-xl font-bold mb-4">Grades</h2>
          {grades.length === 0 ? (
            <p>No grades found.</p>
          ) : (
            grades.map((grade) => (
              <div key={grade._id} className="bg-gray-100 p-4 rounded-lg mb-4">
                <h3 className="font-bold">Student: {grade.student.fname} {grade.student.lname}</h3>
                <p>Grade: {grade.grade}</p>
                <p>Feedback: {grade.feedback}</p>
              </div>
            ))
          )}

          <form onSubmit={handleGradeAssignment} className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-700">Grade</label>
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Submit Grade
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GradeManagement;