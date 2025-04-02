// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const StudentAssignmentDetail = () => {
//   const { assignmentId } = useParams(); // Extract assignmentId from the URL
//   const [assignment, setAssignment] = useState(null);
//   const [file, setFile] = useState(null); // File submission state
//   const [remarks, setRemarks] = useState(""); // Optional remarks
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchAssignment = async () => {
//       try {
//         console.log("Fetching:", `/student/assignments/${assignmentId}`);

//         const response = await axios.get(`/student/assignments/${assignmentId}`);
//         console.log("Response status:", response.status);
//         console.log("Response data:", response.data);

//         // ✅ Extract 'assignment' properly
//         setAssignment(response.data.assignment);
//         console.log("File path:", response.data.assignment.file_path); // ✅ Corrected access
//       } catch (err) {
//         console.error("Error fetching assignment details:", err);
//         setError("Failed to load assignment details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignment();
//   }, [assignmentId]);





//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       toast.error("Please select a file to submit.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("assignmentId", assignmentId);
//     formData.append("file", file);
//     formData.append("remarks", remarks);

//     try {
//       setIsSubmitting(true);
//       const response = await fetch("/api/submit-assignment", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to submit assignment.");

//       toast.success("Assignment submitted successfully!");
//     } catch (err) {
//       console.error("Error submitting assignment:", err);
//       toast.error("Submission failed. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) return <p>Loading assignment details...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
//       <h2 className="text-2xl font-bold mb-4">{assignment.title}</h2>
//       <p className="text-gray-700 mb-2">{assignment.description}</p>
//       <p className="text-gray-700 mb-4">
//         <strong>Due Date:</strong> {assignment.due_date || "N/A"}
//       </p>


//       <a
//         href={`http://localhost:5000${assignment.file_path}`} // ✅ Correct file path
//         target="_blank"
//         rel="noopener noreferrer"
//         download // ✅ Forces browser to download instead of open
//         className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
//       >
//         Download Assignment 2
//       </a>




//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-gray-700">Upload Your Answer</label>
//           <input
//             type="file"
//             onChange={handleFileChange}
//             className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Remarks (Optional)</label>
//           <textarea
//             value={remarks}
//             onChange={(e) => setRemarks(e.target.value)}
//             className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
//           ></textarea>
//         </div>
//         <button
//           type="submit"
//           className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition ${isSubmitting ? "bg-gray-500" : ""
//             }`}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Submitting..." : "Submit Assignment"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default StudentAssignmentDetail;
















// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const StudentAssignmentDetail = () => {
//   const { assignmentId } = useParams(); // Extract assignmentId from the URL
//   const [assignment, setAssignment] = useState(null);
//   const [file, setFile] = useState(null); // File submission state
//   const [remarks, setRemarks] = useState(""); // Optional remarks
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const studentId = localStorage.getItem("studentId"); // Fetch student ID from local storage (if stored)

//   // ✅ Fetch assignment details
//   useEffect(() => {
//     const fetchAssignment = async () => {
//       try {
//         console.log("Fetching:", `/student/assignments/${assignmentId}`);

//         const response = await axios.get(`/student/assignments/${assignmentId}`);
//         console.log("Response status:", response.status);
//         console.log("Response data:", response.data);

//         setAssignment(response.data.assignment);
//       } catch (err) {
//         console.error("Error fetching assignment details:", err);
//         setError("Failed to load assignment details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignment();
//   }, [assignmentId]);

//   // ✅ Handle file input change
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // ✅ Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       toast.error("Please select a file to submit.");
//       return;
//     }

//     // ✅ Prepare form data
//     const formData = new FormData();
//     formData.append("assignmentId", assignmentId);
//     formData.append("studentId", studentId); // Ensure studentId is included
//     formData.append("file", file);
//     formData.append("remarks", remarks);

//     try {
//       setIsSubmitting(true);
//       const response = await axios.post("/student/assignment/submit", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         withCredentials: true, // ✅ Ensure cookies/session data is sent
//       });

//       toast.success("Assignment submitted successfully!");
//       console.log("Submission response:", response.data);
//     } catch (err) {
//       console.error("Error submitting assignment:", err);
//       toast.error("Submission failed. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) return <p>Loading assignment details...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
//       <h2 className="text-2xl font-bold mb-4">{assignment.title}</h2>
//       <p className="text-gray-700 mb-2">{assignment.description}</p>
//       <p className="text-gray-700 mb-4">
//         <strong>Due Date:</strong> {assignment.due_date || "N/A"}
//       </p>

//       {/* ✅ Download Assignment */}
//       <a
//         href={`http://localhost:5000${assignment.file_path}`} // ✅ Correct file path
//         target="_blank"
//         rel="noopener noreferrer"
//         download // ✅ Forces browser to download instead of open
//         className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
//       >
//         Download Assignment
//       </a>

//       {/* ✅ Submit Assignment Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-gray-700">Upload Your Answer</label>
//           <input
//             type="file"
//             onChange={handleFileChange}
//             className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Remarks (Optional)</label>
//           <textarea
//             value={remarks}
//             onChange={(e) => setRemarks(e.target.value)}
//             className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
//           ></textarea>
//         </div>
//         <button
//           type="submit"
//           className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition ${
//             isSubmitting ? "bg-gray-500" : ""
//           }`}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Submitting..." : "Submit Assignment"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default StudentAssignmentDetail;



import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';

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
        console.log("Fetching:", `/student/assignments/${assignmentId}`);
        const response = await axios.get(`/student/assignments/${assignmentId}`);
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        
        // ✅ Extract 'assignment' properly
        setAssignment(response.data.assignment);
        console.log("File path:", response.data.assignment.file_path); // ✅ Corrected access
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

    // ✅ Retrieve studentId from local storage
    const studentId = localStorage.getItem("userObjectId");
    if (!studentId) {
      toast.error("Student ID is missing. Please log in again.");
      return;
    }

    if (!file) {
      toast.error("Please select a file to submit.");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("studentId", studentId); // ✅ Include student ID
    formData.append("file", file);
    formData.append("remarks", remarks);

    try {
      setIsSubmitting(true);
      const response = await axios.post("/student/assignment/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status !== 201) throw new Error("Failed to submit assignment.");
      
      toast.success("Assignment submitted successfully!");
    } catch (err) {
      console.error("Error submitting assignment:", err);
      toast.error("Submission failed. Please try again.");
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
        href={`http://localhost:5000${assignment.file_path}`} // ✅ Correct file path
        target="_blank"
        rel="noopener noreferrer"
        download // ✅ Forces browser to download instead of open
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Download Assignment
      </a>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Upload Your Answer</label>
          {/* <input
            type="file"
            onChange={handleFileChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          /> */}
          <input
  type="file"
  onChange={handleFileChange}
  className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300 text-gray-900 bg-white"
  required
/>

        </div>
        <div>
          <label className="block text-gray-700">Remarks (Optional)</label>
          {/* <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
          ></textarea> */}
          <textarea
  value={remarks}
  onChange={(e) => setRemarks(e.target.value)}
  className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300 placeholder-gray-400 text-gray-900"
  placeholder="Add any additional comments about your submission"
/>

        </div>
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition ${isSubmitting ? "bg-gray-500" : ""
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
