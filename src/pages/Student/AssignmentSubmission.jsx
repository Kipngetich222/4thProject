import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/axiosConfig";
import { toast } from "react-toastify";

const AssignmentSubmission = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      // Fetch assignment details
      const assignmentResponse = await axios.get(`/assignments/student/assignments/${assignmentId}`);
      setAssignment(assignmentResponse.data);

      // Check for existing submission
      const submissionResponse = await axios.get(`/assignments/student/submissions/${assignmentId}`);
      setExistingSubmission(submissionResponse.data);
    } catch (error) {
      console.error("Error fetching assignment details:", error);
      toast.error(error.response?.data?.error || "Failed to load assignment details");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to submit");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("remarks", remarks);
    formData.append("assignmentId", assignmentId);

    try {
      setSubmitting(true);
      await axios.post("/assignments/student/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Assignment submitted successfully!");
      setTimeout(() => navigate("/student/assignments"), 2000);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error(error.response?.data?.error || "Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!assignment) {
    return <div className="container mx-auto px-4 py-8">Assignment not found</div>;
  }

  const isOverdue = new Date(assignment.due_date) < new Date();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Submit Assignment</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{assignment.title}</h2>
          <p className="text-gray-600 mb-2">{assignment.description}</p>
          <div className="flex justify-between text-sm text-gray-500">
            <p>Subject: {assignment.subject}</p>
            <p className={`${isOverdue ? 'text-red-500' : 'text-green-500'}`}>
              Due: {new Date(assignment.due_date).toLocaleString()}
            </p>
          </div>
        </div>

        {existingSubmission && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Previous Submission</h3>
            <p>Submitted on: {new Date(existingSubmission.submitted_at).toLocaleString()}</p>
            <a
              href={`http://localhost:5000${existingSubmission.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Submitted File
            </a>
            {existingSubmission.grade && (
              <div className="mt-2">
                <p className="font-semibold">Grade: {existingSubmission.grade}</p>
                <p>Feedback: {existingSubmission.feedback || 'No feedback provided'}</p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Upload Your Work</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Remarks (Optional)</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 h-24"
              placeholder="Add any comments or notes about your submission..."
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/student/assignments")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (!file && !existingSubmission)}
              className={`${
                submitting
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white px-6 py-2 rounded`}
            >
              {submitting ? "Submitting..." : existingSubmission ? "Resubmit" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentSubmission;
