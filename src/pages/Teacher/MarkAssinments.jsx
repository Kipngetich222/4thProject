import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MarkSubmission = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSubmission();
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/assignments/teacher/assignments/submissions/mark/${submissionId}`);
      setSubmission(response.data);
      setGrade(response.data.grade || "");
      setFeedback(response.data.feedback || "");
      setError(null);
    } catch (err) {
      console.error("Error fetching submission:", err);
      setError("Failed to load submission.");
      toast.error("Failed to load submission");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!grade) {
      toast.error("Please enter a grade");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(`/api/assignments/teacher/assignments/submissions/mark/${submissionId}`, {
        grade: parseFloat(grade),
        feedback: feedback
      });

      toast.success("Grade submitted successfully!");
      navigate(-1); // Go back to submissions list
    } catch (err) {
      console.error("Error submitting grade:", err);
      toast.error("Failed to submit grade");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading submission...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!submission) return <p>Submission not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Grade Submission</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Student Information</h2>
          <p className="text-gray-700">
            {submission.student_id.fname} {submission.student_id.lname} (ID: {submission.student_id.userNo})
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Submission Details</h2>
          <p className="text-gray-700 mb-2">
            Submitted on: {new Date(submission.submitted_at).toLocaleString()}
          </p>
          <p className="text-gray-700 mb-2">
            Remarks: {submission.remarks || "No remarks"}
          </p>
          <a
            href={`http://localhost:5000${submission.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View Submission File
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Grade (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
              rows="4"
              placeholder="Enter feedback for the student"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md text-white transition ${
              isSubmitting ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Grade"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarkSubmission;
