import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


const MarkSubmission = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [marks, setMarks] = useState("");
  const [teacherRemarks, setTeacherRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    console.log("Fetching submission with ID:", submissionId);  // ✅ Debugging
    const fetchSubmission = async () => {
        try {
            //const response = await axios.get(`/teacher/assignments/submissions/${submissionId}`);
            const response = await axios.get(`/teacher/assignments/submissions/mark/${submissionId}`);
            setSubmission(response.data);
            console.log("Submission details:", response.data);
        } catch (err) {
            console.error("Error fetching submission:", err);
            setError("Failed to load submission.");
        } finally {
            setLoading(false);
        }
    };
    fetchSubmission();
}, [submissionId]);


  // ✅ Handle Form Submission
  const handleMarking = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/teacher/assignments/mark/${submissionId}`, {
        marks,
        teacherRemarks,
      });

      toast.success("Marks awarded successfully!");
      console.log("Updated submission:", response.data);
    } catch (error) {
      console.error("Error marking submission:", error);
      toast.error("Failed to award marks.");
    }
  };

  if (loading) return <p>Loading submission details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Mark Submission</h2>
      <p className="text-gray-700 mb-2">Student: {submission.studentId.name}</p>
      <p className="text-gray-700 mb-2">Assignment: {submission.assignmentId.title}</p>

      <a
        href={`http://localhost:5000/${submission.fileUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline mb-4 inline-block"
      >
        View Submitted File
      </a>

      <form onSubmit={handleMarking} className="space-y-4">
        <div>
          <label className="block text-gray-700">Marks (out of 100)</label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Teacher Remarks</label>
          <textarea
            value={teacherRemarks}
            onChange={(e) => setTeacherRemarks(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Submit Marks
        </button>
      </form>
    </div>
  );
};

export default MarkSubmission;
