import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentAssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch assignments from the backend
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("/student/assignments"); // API endpoint to fetch assignments
    //    const response = await axios.get("/teacher/assignments");
        setAssignments(response.data); // Store fetched assignments in state
      } catch (err) {
        console.error("Error fetching assignments:", err);
        setError("Failed to load assignments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Navigate to the submission page with the assignmentId
  const handleSubmissionClick = (assignmentId) => {
    navigate(`/submit-assignment/${assignmentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Assigned Tasks</h1>

      {loading && <p>Loading assignments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && assignments.length === 0 && <p>No assignments available yet.</p>}

      {!loading && !error && assignments.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Titleyyyy</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Due Date</th>
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id} className="border">
                  <td className="border px-4 py-2">{assignment.title}</td>
                  <td className="border px-4 py-2">{assignment.description}</td>
                  <td className="border px-4 py-2">{assignment.due_date || "N/A"}</td>
                  <td className="border px-4 py-2">{assignment.subject || "N/A"}</td>
                  <td className="border px-4 py-2 text-center">
                    {/* <button
                      onClick={() => handleSubmissionClick(assignment._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Submit Assignment
                    </button> */}
                    <button
                      onClick={() => navigate(`/student/assignments/${assignment._id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Open Assignment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

  );
};

export default StudentAssignmentList;


