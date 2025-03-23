import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const StudentAssignmentDetail = () => {
  const { assignmentId } = useParams(); // Extract assignmentId from the URL
  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null); // File submission state
  const [remarks, setRemarks] = useState(""); // Optional remarks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


useEffect(() => {
  const fetchAssignment = async () => {
    try {
      console.log("Fetching:", `/student/assignments/${assignmentId}`); // ✅ Log request

      const response = await fetch(`/student/assignments/${assignmentId}`);

      console.log("Response status:", response.status); // ✅ Log response status
      console.log("Response content-type:", response.headers.get("content-type")); // ✅ Check type

      if (!response.ok) {
        const text = await response.text(); // Read the response as text
        throw new Error(`Error: ${response.status} - ${text}`);
      }

      const data = await response.json();
      console.log("Fetched assignment:", data);
      setAssignment(data.assignment);
    } catch (err) {
      console.error("Error fetching assignment details:", err);
      setError("Failed to load assignment details.");
    } finally {
      setLoading(false);
    }
  };

  fetchAssignment();
}, [assignmentId]);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to submit.");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("file", file);
    formData.append("remarks", remarks);

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/submit-assignment", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit assignment.");

      alert("Assignment submitted successfully!");
    } catch (err) {
      console.error("Error submitting assignment:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading assignment details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{assignment.title}</h2>
      <p className="text-gray-700 mb-2">{assignment.description}</p>
      <p className="text-gray-700 mb-4">
        <strong>Due Date:</strong> {assignment.due_date || "N/A"}
      </p>

      <a
        href={`http://localhost:5000${assignment.file_path}`} // Replace with actual file URL
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Download Assignment
      </a>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Upload Your Answer</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Remarks (Optional)</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
          ></textarea>
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition ${
            isSubmitting ? "bg-gray-500" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Assignment"}
        </button>
      </form>
    </div>
  );
};

export default StudentAssignmentDetail;