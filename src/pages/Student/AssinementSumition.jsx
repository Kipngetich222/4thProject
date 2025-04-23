import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SubmitAssignment({ assignmentId }) {
  const [file, setFile] = useState(null); // State to store the selected file
  const [remarks, setRemarks] = useState(""); // State for optional remarks
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Capture the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId); // Attach assignment ID
    formData.append("file", file); // Attach the file
    formData.append("remarks", remarks); // Attach any remarks (optional)

    try {
      setIsSubmitting(true);

      const response = await axios.post("/api/assignments/student/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Assignment submitted successfully!");
      setFile(null); // Clear the file input
      setRemarks(""); // Clear the remarks field
      navigate("/student/assignments");
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error("Failed to submit assignment. Please try again.");
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
