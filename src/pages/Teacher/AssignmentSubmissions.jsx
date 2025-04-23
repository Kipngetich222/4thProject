import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/axiosConfig";
import { toast } from "react-toastify";

const AssignmentSubmissions = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      // Fetch assignment details
      const assignmentResponse = await axios.get(`/assignments/teacher/assignments/${assignmentId}`);
      setAssignment(assignmentResponse.data);

      // Fetch submissions
      const submissionsResponse = await axios.get(
        `/assignments/teacher/assignments/${assignmentId}/submissions`
      );
      setSubmissions(submissionsResponse.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error(error.response?.data?.error || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmit = async (submissionId) => {
    if (!grading || !grading[submissionId]) return;

    const { grade, feedback } = grading[submissionId];
    if (!grade) {
      toast.error("Please enter a grade");
      return;
    }

    try {
      await axios.post(`/assignments/teacher/assignments/submissions/mark/${submissionId}`, {
        grade,
        feedback,
      });

      toast.success("Submission graded successfully!");
      fetchSubmissions(); // Refresh the submissions list
      setGrading((prev) => ({
        ...prev,
        [submissionId]: null,
      }));
    } catch (error) {
      console.error("Error grading submission:", error);
      toast.error(error.response?.data?.error || "Failed to grade submission");
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!assignment) {
    return <div className="container mx-auto px-4 py-8">Assignment not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate("/teacher/assignments")}
          className="mb-4 text-blue-500 hover:text-blue-600"
        >
          ← Back to Assignments
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{assignment.title}</h1>
        <p className="text-gray-600 mb-2">{assignment.description}</p>
        <div className="flex gap-4 text-sm text-gray-500">
          <p>Due: {new Date(assignment.due_date).toLocaleString()}</p>
          <p>Subject: {assignment.subject}</p>
          <p>Classes: {assignment.classes.join(", ")}</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <p className="text-gray-600">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Student</th>
                <th className="border px-4 py-2">Submitted At</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">File</th>
                <th className="border px-4 py-2">Remarks</th>
                <th className="border px-4 py-2">Grade</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => {
                const isLate =
                  new Date(submission.submitted_at) > new Date(assignment.due_date);
                return (
                  <tr key={submission._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">
                      {submission.student_id.fname} {submission.student_id.lname}
                      <div className="text-xs text-gray-500">
                        ID: {submission.student_id.userNo}
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      <span className={isLate ? "text-red-500" : "text-green-500"}>
                        {new Date(submission.submitted_at).toLocaleString()}
                        {isLate && " (Late)"}
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      {submission.grade ? "Graded" : "Pending"}
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
                      {submission.grade ? (
                        <div>
                          <div className="font-semibold">{submission.grade}</div>
                          <div className="text-sm text-gray-500">
                            {submission.feedback || "No feedback"}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Grade"
                            className="w-20 border rounded px-2 py-1"
                            onChange={(e) =>
                              setGrading((prev) => ({
                                ...prev,
                                [submission._id]: {
                                  ...prev?.[submission._id],
                                  grade: e.target.value,
                                },
                              }))
                            }
                          />
                          <textarea
                            placeholder="Feedback"
                            className="w-full border rounded px-2 py-1"
                            onChange={(e) =>
                              setGrading((prev) => ({
                                ...prev,
                                [submission._id]: {
                                  ...prev?.[submission._id],
                                  feedback: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {!submission.grade && (
                        <button
                          onClick={() => handleGradeSubmit(submission._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Submit Grade
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmissions;
