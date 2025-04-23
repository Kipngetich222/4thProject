import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const StudentAssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/assignments/student/assignments");
      setAssignments(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError("Failed to load assignments.");
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Your Assignments</h1>

      {loading && <p>Loading assignments...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && assignments.length === 0 && (
        <p>No assignments available.</p>
      )}

      {!loading && !error && assignments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Due Date</th>
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">File</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id} className="border">
                  <td className="border px-4 py-2">{assignment.title}</td>
                  <td className="border px-4 py-2">{assignment.description}</td>
                  <td className="border px-4 py-2">
                    {assignment.due_date
                      ? new Date(assignment.due_date).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {assignment.subject || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    <a
                      href={`http://localhost:5000${assignment.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View File
                    </a>
                  </td>
                  <td className="border px-4 py-2">
                    <Link
                      to={`/student/assignments/${assignment._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Submit Assignment
                    </Link>
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


