// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const SubmissionsList = () => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ Fetch submissions from the backend
//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       try {
//         const response = await axios.get("/teacher/assignments/:assignmentId/submissions"); // Update API endpoint accordingly
//         setSubmissions(response.data); // Store fetched submissions in state
//       } catch (err) {
//         console.error("Error fetching submissions:", err);
//         setError("Failed to load submissions.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubmissions();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-blue-800 mb-6">Student Submissions</h1>

//       {loading && <p>Loading submissions...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && !error && submissions.length === 0 && <p>No submissions found.</p>}

//       {!loading && !error && submissions.length > 0 && (
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <table className="min-w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border px-4 py-2">Student Name</th>
//                 <th className="border px-4 py-2">Assignment Title</th>
//                 <th className="border px-4 py-2">Submission Date</th>
//                 <th className="border px-4 py-2">File</th>
//                 <th className="border px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {submissions.map((submission) => (
//                 <tr key={submission._id} className="border">
//                   <td className="border px-4 py-2">{submission.student_name}</td>
//                   <td className="border px-4 py-2">{submission.assignment_title}</td>
//                   <td className="border px-4 py-2">{submission.submission_date || "N/A"}</td>
//                   <td className="border px-4 py-2">
//                     <a
//                       href={`http://localhost:5000${submission.file_path}`} // Adjust file path based on your backend setup
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-500 underline"
//                     >
//                       View File
//                     </a>
//                   </td>
//                   <td className="border px-4 py-2">
//                     {/* Add any required actions, like marking or commenting */}
//                     <button
//                       className="bg-blue-500 text-white px-3 py-1 rounded"
//                       onClick={() => alert(`Marking submission for ${submission.student_name}`)}
//                     >
//                       Mark Submission
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SubmissionsList;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SubmissionsList = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const { assignmentId } = useParams(); // Get assignment ID from URL
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch submissions from backend
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`/teacher/assignments/submissions/${assignmentId}`);
        setSubmissions(response.data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Student Submissions</h1>

      {loading && <p>Loading submissions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && submissions.length === 0 && <p>No submissions found.</p>}

      {!loading && !error && submissions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Student Name</th>
                <th className="border px-4 py-2">Assignment Title</th>
                <th className="border px-4 py-2">Submission Date</th>
                <th className="border px-4 py-2">File</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id} className="border">
                  <td className="border px-4 py-2">{submission.studentId?.name || "Unknown"}</td>
                  <td className="border px-4 py-2">{submission.assignmentId?.title || "N/A"}</td>
                  <td className="border px-4 py-2">{new Date(submission.createdAt).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">
                    <a
                      href={`http://localhost:5000/${submission.fileUrl}`} // Ensure this matches backend storage
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View File
                    </a>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => navigate(`/teacher/assingments/submissions/mark/${submission._id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Mark Submission
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmissionsList;
