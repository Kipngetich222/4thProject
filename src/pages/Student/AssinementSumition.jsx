import React, { useState } from "react";

export default function SubmitAssignment({ assignmentId, studentId }) {
  const [file, setFile] = useState(null); // State to store the selected file
  const [remarks, setRemarks] = useState(""); // State for optional remarks
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Capture the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId); // Attach assignment ID
    formData.append("studentId", studentId); // Attach student ID
    formData.append("file", file); // Attach the file
    formData.append("remarks", remarks); // Attach any remarks (optional)

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/submit-assignment", {
        method: "POST",
        body: formData, // Send FormData as the body
      });

      if (!response.ok) {
        throw new Error("Failed to submit assignment.");
      }

      alert("Assignment submitted successfully!");
      setFile(null); // Clear the file input
      setRemarks(""); // Clear the remarks field
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Submit Assignment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* File Upload */}
        <div>
          <label className="block text-gray-700">Upload File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-gray-700">Remarks (Optional)</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="Add any additional comments about your submission"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white transition ${
            isSubmitting ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
