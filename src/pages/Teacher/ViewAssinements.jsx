import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch assignments from the backend
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("/teacher/assignments");
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Uploaded Assignments</h1>

      {loading && <p>Loading assignments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && assignments.length === 0 && <p>No assignments uploaded yet.</p>}

      {!loading && !error && assignments.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Due Date</th>
                <th className="border px-4 py-2">Classes</th>
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">File</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id} className="border">
                  <td className="border px-4 py-2">{assignment.title}</td>
                  <td className="border px-4 py-2">{assignment.description}</td>
                  <td className="border px-4 py-2">{assignment.due_date || "N/A"}</td>
                  <td className="border px-4 py-2">{assignment.classes.join(", ")}</td>
                  <td className="border px-4 py-2">{assignment.subject || "N/A"}</td>
                  <td className="border px-4 py-2">
                    {/* <a
                      href={`http://localhost:5000/${assignment.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View File
                    </a> */}
                    <a
                      href={`http://localhost:5000${assignment.file_path}`} // ✅ Fix: Use correct file path
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View File
                    </a>




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
