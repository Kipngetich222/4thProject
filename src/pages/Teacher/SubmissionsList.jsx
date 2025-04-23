import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SubmissionsList = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/assignments/teacher/assignments/${assignmentId}/submissions`);
      setSubmissions(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError("Failed to load submissions.");
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Assignment Submissions</h1>

      {loading && <p>Loading submissions...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && submissions.length === 0 && (
        <p>No submissions yet.</p>
      )}

      {!loading && !error && submissions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Student Name</th>
                <th className="border px-4 py-2">Student ID</th>
                <th className="border px-4 py-2">Submission Date</th>
                <th className="border px-4 py-2">File</th>
                <th className="border px-4 py-2">Remarks</th>
                <th className="border px-4 py-2">Grade</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id} className="border">
                  <td className="border px-4 py-2">
                    {submission.student_id.fname} {submission.student_id.lname}
                  </td>
                  <td className="border px-4 py-2">
                    {submission.student_id.userNo}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(submission.submitted_at).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">
                    <a
                      href={`http://localhost:5000${submission.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Submission
                    </a>
                  </td>
                  <td className="border px-4 py-2">
                    {submission.remarks || "No remarks"}
                  </td>
                  <td className="border px-4 py-2">
                    {submission.grade !== undefined ? submission.grade : "Not graded"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => navigate(`/teacher/assignments/submissions/mark/${submission._id}`)}
                      className="text-blue-500 hover:underline"
                    >
                      Grade
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

export default SubmissionsList;

