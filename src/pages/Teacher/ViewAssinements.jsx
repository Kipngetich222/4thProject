import React, { useState, useEffect } from "react";
import axios from "../../services/axiosConfig";  
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/assignments/teacher/assignments");
      setAssignments(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError("Failed to load assignments.");
      toast.error(err.response?.data?.error || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Uploaded Assignments</h1>
        <Link
          to="/teacher/upload-assignment"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload New Assignment
        </Link>
      </div>

      {loading && <p className="text-gray-600">Loading assignments...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && assignments.length === 0 && (
        <p className="text-gray-600">No assignments uploaded yet.</p>
      )}

      {!loading && !error && assignments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Due Date</th>
                <th className="border px-4 py-2">Classes</th>
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">File</th>
                <th className="border px-4 py-2">Submissions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{assignment.title}</td>
                  <td className="border px-4 py-2">{assignment.description}</td>
                  <td className="border px-4 py-2">
                    {assignment.due_date
                      ? new Date(assignment.due_date).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {assignment.classes.join(", ")}
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
                      to={`/teacher/assignments/${assignment._id}/submissions`}
                      className="text-blue-500 hover:underline"
                    >
                      View Submissions
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

export default AssignmentList;
