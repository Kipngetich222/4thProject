// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// const TeacherGrades = () => {
//   const [grades, setGrades] = useState([]); // State to store grades

//   // Fetch grades when the component loads
//   useEffect(() => {
//     fetchGrades();
//   }, []);

//   // Fetch grades from backend
//   const fetchGrades = async () => {
//     try {
//       const response = await axios.get("/teacher/grades"); // Simple GET request without filters
//       setGrades(response.data); // Set the grades data
//     } catch (error) {
//       console.error("Error fetching grades:", error);
//       toast.error("Failed to fetch grades.");
//     }
//   };

//   const handleUploadClick = () => {
//     // Navigate or open modal to upload grades
//     toast.success("Navigate to upload grades page or open a modal.");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-blue-800 mb-6">Grades Management</h1>

//       {/* Grades Table */}
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Grades</h2>
//         <button
//           onClick={handleUploadClick}
//           className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//         >
//           Upload New Grades
//         </button>
//         {grades.length > 0 ? (
//           <table className="w-full table-auto">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="px-4 py-2">Class</th>
//                 <th className="px-4 py-2">Stream</th>
//                 <th className="px-4 py-2">Subject</th>
//                 <th className="px-4 py-2">Exam</th>
//                 <th className="px-4 py-2">Student</th>
//                 <th className="px-4 py-2">Marks</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {grades.map((grade) =>
//                 grade.subjects.map((subject) =>
//                   subject.grades.map((studentGrade) => (
//                     <tr key={studentGrade.studentId}>
//                       <td className="border px-4 py-2">{grade.class}</td>
//                       <td className="border px-4 py-2">{grade.stream}</td>
//                       <td className="border px-4 py-2">{subject.subjectName}</td>
//                       <td className="border px-4 py-2">{grade.exam}</td>
//                       <td className="border px-4 py-2">{studentGrade.studentId}</td>
//                       <td className="border px-4 py-2">{studentGrade.marks}</td>
//                       <td className="border px-4 py-2">
//                         <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
//                           Edit
//                         </button>
//                         <button className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )
//               )}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-gray-600">No grades found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeacherGrades;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const TeacherGrades = () => {
  const [grades, setGrades] = useState([]); // State to store grades

  // Fetch grades when the component loads
  useEffect(() => {
    fetchGrades();
  }, []);

  // Fetch grades from backend
  const fetchGrades = async () => {
    try {
      const response = await axios.get("/teacher/grades"); // Simple GET request
      setGrades(response.data); // Set the grades data from the API response
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast.error("Failed to fetch grades.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Grades Management</h1>

      {/* Grades Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Grades</h2>
        {grades.length > 0 ? (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Academic Year</th>
                <th className="px-4 py-2">Class</th>
                <th className="px-4 py-2">Stream</th>
                <th className="px-4 py-2">Term</th>
                <th className="px-4 py-2">Exam</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Student ID</th>
                <th className="px-4 py-2">Marks</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade._id}>
                  <td className="border px-4 py-2">{grade.academicYear}</td>
                  <td className="border px-4 py-2">{grade.class}</td>
                  <td className="border px-4 py-2">{grade.stream}</td>
                  <td className="border px-4 py-2">{grade.term}</td>
                  <td className="border px-4 py-2">{grade.exam}</td>
                  <td className="border px-4 py-2">{grade.subjectName}</td>
                  <td className="border px-4 py-2">{grade.studentId}</td>
                  <td className="border px-4 py-2">{grade.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No grades found.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherGrades;

