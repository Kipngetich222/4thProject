// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// const StdPerformance = () => {
//   const [grades, setGrades] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [children, setChildren] = useState([]); // Store parent's children IDs

//   useEffect(() => {
//     fetchGrades();
//   }, []);

//   // Fetch the parent's children grades
//   const fetchGrades = async () => {
//     try {
//       const response = await axios.get("/parent/grades"); // API endpoint to get parent's children grades
//       setGrades(response.data);
//       if (response.data.length > 0) {
//         // Extract student IDs from response
//         const childIds = response.data.flatMap((grade) =>
//           grade.subjects.flatMap((subject) =>
//             subject.grades.map((entry) => entry.stdNo)
//           )
//         );
//         setChildren([...new Set(childIds)]); // Remove duplicates
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching grades:", error);
//       toast.error("Failed to fetch grades.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-blue-800 mb-6">Student Performance</h1>

//       {loading ? (
//         <p>Loading...</p>
//       ) : grades.length > 0 ? (
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Child's Performance</h2>

//           {children.map((childId) => {
//             let totalMarks = 0; // Initialize total marks for this child

//             return (
//               <div key={childId} className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-700">Student No: {childId}</h3>
//                 {grades.map((grade) => (
//                   <div key={grade._id} className="mb-4">
//                     <h4 className="text-md font-semibold text-gray-700">
//                       {grade.academicYear} - {grade.term} ({grade.exam})
//                     </h4>
//                     <table className="w-full table-auto border-collapse border border-gray-300 mt-2">
//                       <thead>
//                         <tr className="bg-gray-200 text-black">
//                           <th className="border px-4 py-2">Subject</th>
//                           <th className="border px-4 py-2">Marks</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {grade.subjects.map((subject) =>
//                           subject.grades
//                             .filter((entry) => entry.stdNo === childId) // Only show grades for this child
//                             .map((entry) => {
//                               totalMarks += entry.marks; // Add to total
//                               return (
//                                 <tr key={entry._id}>
//                                   <td className="border px-4 py-2 text-gray-900">{subject.subjectName}</td>
//                                   <td className="border px-4 py-2 text-gray-900">{entry.marks}</td>
//                                 </tr>
//                               );
//                             })
//                         )}
//                       </tbody>
//                       {/* Total row */}
//                       <tfoot>
//                         <tr className="bg-gray-300 text-black font-bold">
//                           <td className="border px-4 py-2">Total</td>
//                           <td className="border px-4 py-2">{totalMarks}</td>
//                         </tr>
//                       </tfoot>
//                     </table>
//                   </div>
//                 ))}
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <p className="text-gray-600">No grades found for your child.</p>
//       )}
//     </div>
//   );
// };

// export default StdPerformance;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const StdPerformance = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]); // Store parent's children IDs

  useEffect(() => {
    fetchGrades();
  }, []);

  // Fetch the parent's children grades
  const fetchGrades = async () => {
    try {
      const response = await axios.get("/parent/grades"); // API endpoint to get parent's children grades
      setGrades(response.data);
      if (response.data.length > 0) {
        // Extract student IDs from response
        const childIds = response.data.flatMap((grade) =>
          grade.subjects.flatMap((subject) =>
            subject.grades.map((entry) => entry.stdNo)
          )
        );
        setChildren([...new Set(childIds)]); // Remove duplicates
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast.error("Failed to fetch grades.");
      setLoading(false);
    }
  };

  // Function to get letter grade based on marks
  const getGrade = (marks) => {
    if (marks >= 80) return "A";
    if (marks >= 75) return "A-";
    if (marks >= 70) return "B+";
    if (marks >= 65) return "B";
    if (marks >= 60) return "B-";
    if (marks >= 55) return "C+";
    if (marks >= 50) return "C";
    if (marks >= 45) return "C-";
    if (marks >= 40) return "D+";
    if (marks >= 35) return "D";
    if (marks >= 30) return "D-";
    return "E"; // Below 30
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Student Performance</h1>

      {loading ? (
        <p>Loading...</p>
      ) : grades.length > 0 ? (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Child's Performance</h2>

          {children.map((childId) => {
            let totalMarks = 0; // Initialize total marks for this child

            return (
              <div key={childId} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700">Student No: {childId}</h3>
                {grades.map((grade) => (
                  <div key={grade._id} className="mb-4">
                    <h4 className="text-md font-semibold text-gray-700">
                      {grade.academicYear} - {grade.term} ({grade.exam})
                    </h4>
                    <table className="w-full table-auto border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-200 text-black">
                          <th className="border px-4 py-2">Subject</th>
                          <th className="border px-4 py-2">Marks</th>
                          <th className="border px-4 py-2">Grade</th> {/* New Grade Column */}
                        </tr>
                      </thead>
                      <tbody>
                        {grade.subjects.map((subject) =>
                          subject.grades
                            .filter((entry) => entry.stdNo === childId) // Only show grades for this child
                            .map((entry) => {
                              totalMarks += entry.marks; // Add to total
                              return (
                                <tr key={entry._id}>
                                  <td className="border px-4 py-2 text-gray-900">{subject.subjectName}</td>
                                  <td className="border px-4 py-2 text-gray-900">{entry.marks}</td>
                                  <td className="border px-4 py-2 text-gray-900">{getGrade(entry.marks)}</td> {/* Display Grade */}
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                      {/* Total row */}
                      <tfoot>
                        <tr className="bg-gray-300 text-black font-bold">
                          <td className="border px-4 py-2">Total</td>
                          <td className="border px-4 py-2">{totalMarks}</td>
                          <td className="border px-4 py-2"></td> {/* Empty for grade column */}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">No grades found for your child.</p>
      )}
    </div>
  );
};

export default StdPerformance;


