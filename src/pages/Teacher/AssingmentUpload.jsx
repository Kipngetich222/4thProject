import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../services/axiosConfig";  // Import the configured axios instance

const AssignmentUpload = () => {
  const navigate = useNavigate();
  const [assignmentDetails, setAssignmentDetails] = useState({
    title: "",
    description: "",
    classes: [],
    subject: "",
    due_date: "",
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentDetails({ ...assignmentDetails, [name]: value });
  };

  const handleClassesChange = (e) => {
    const classList = e.target.value.split(",").map((c) => c.trim());
    setAssignmentDetails({ ...assignmentDetails, classes: classList });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, classes, subject, due_date } = assignmentDetails;

    if (!title || !description || !classes.length || !subject || !due_date || !file) {
      toast.error("Please fill in all required fields and upload a file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("classes", classes.join(","));
    formData.append("subject", subject);
    formData.append("due_date", due_date);
    formData.append("file", file);

    console.log('Sending form data:', {
      title,
      description,
      classes: classes.join(","),
      subject,
      due_date,
      file: file.name
    });

    try {
      setIsSubmitting(true);
      const response = await axios.post("/assignments/teacher/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Assignment uploaded successfully!");
      setTimeout(() => navigate("/teacher/assignments"), 2000);
    } catch (error) {
      console.error("Error uploading assignment:", error.response?.data || error);
      toast.error(error.response?.data?.error || "Failed to upload assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Assignment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600">Title *</label>
          <input
            type="text"
            name="title"
            value={assignmentDetails.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600">Description *</label>
          <textarea
            name="description"
            value={assignmentDetails.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600">Classes (comma-separated) *</label>
          <input
            type="text"
            name="classes"
            value={assignmentDetails.classes.join(", ")}
            onChange={handleClassesChange}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600">Subject *</label>
          <input
            type="text"
            name="subject"
            value={assignmentDetails.subject}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600">Due Date *</label>
          <input
            type="datetime-local"
            name="due_date"
            value={assignmentDetails.due_date}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600">Upload File *</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white transition ${
            isSubmitting ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Uploading..." : "Upload Assignment"}
        </button>
      </form>
    </div>
  );
};

export default AssignmentUpload;
