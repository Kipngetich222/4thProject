import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SubmitAssignment from "./AssinementSumition.jsx";

const StudentAssignmentDetail = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/assignments/student/assignments/${assignmentId}`);
      setAssignment(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching assignment details:", err);
      setError("Failed to load assignment details.");
      toast.error("Failed to load assignment details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading assignment details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!assignment) return <p>Assignment not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">{assignment.title}</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{assignment.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold">Due Date</h3>
            <p>{new Date(assignment.due_date).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold">Subject</h3>
            <p>{assignment.subject}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Assignment File</h3>
          <a
            href={`http://localhost:5000${assignment.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View Assignment File
          </a>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Submit Your Work</h2>
        <SubmitAssignment assignmentId={assignmentId} />
      </div>
    </div>
  );
};

export default StudentAssignmentDetail;

