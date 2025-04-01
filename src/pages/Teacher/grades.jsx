// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// const TeacherGrades = () => {
//   const [grades, setGrades] = useState([]);
//   const [editedGrades, setEditedGrades] = useState({});

//   useEffect(() => {
//     fetchGrades();
//   }, []);

//   // Fetch grades from backend
//   const fetchGrades = async () => {
//     try {
//       const response = await axios.get("/teacher/grades");
//       console.log(response.data);
//       setGrades(response.data);
//     } catch (error) {
//       console.error("Error fetching grades:", error);
//       toast.error("Failed to fetch grades.");
//     }
//   };

//   // Handle inline grade edits
//   const handleEdit = (stdNo, subject, newMarks) => {
//     setEditedGrades((prev) => ({
//       ...prev,
//       [`${stdNo}-${subject}`]: newMarks,
//     }));
//   };

//   // Save updated grade
//   const handleSave = async (stdNo, subjectName) => {
//     const updatedMarks = editedGrades[`${stdNo}-${subjectName}`];

//     if (updatedMarks === undefined) return; // No changes made

//     try {
//       await axios.put(`/teacher/grades`, {
//         stdNo,
//         subjectName,
//         marks: updatedMarks,
//       });

//       toast.success("Grade updated successfully!");
//       fetchGrades(); // Refresh data
//     } catch (error) {
//       console.error("Error updating grades:", error);
//       toast.error("Failed to update grade.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-blue-800 mb-6">Grades Management</h1>

//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Grades</h2>
//         {grades.length > 0 ? (
//           <table className="w-full table-auto border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200 text-black">
//                 <th className="border px-4 py-2">No</th>
//                 <th className="border px-4 py-2">Name</th>
//                 <th className="border px-4 py-2">UserNo</th>
//                 <th className="border px-4 py-2">Class</th>
//                 <th className="border px-4 py-2">Stream</th>
//                 <th className="border px-4 py-2">Math</th>
//                 <th className="border px-4 py-2">English</th>
//                 <th className="border px-4 py-2">Kiswahili</th>
//                 <th className="border px-4 py-2">CRE</th>
//                 <th className="border px-4 py-2">Chemistry</th>
//                 <th className="border px-4 py-2">Total</th>
//                 <th className="border px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {grades.flatMap((grade) =>
//                 grade.subjects.flatMap((subject) =>
//                   subject.grades.map((entry, index) => ({
//                     ...entry,
//                     subjectName: subject.subjectName,
//                     key: `${grade._id}-${entry.stdNo}-${subject.subjectName}-${index}`
//                   }))
//                 )
//               ).reduce((acc, entry) => {
//                 let existingStudent = acc.find((row) => row.stdNo === entry.stdNo);
//                 if (!existingStudent) {
//                   existingStudent = {
//                     stdNo: entry.stdNo,
//                     studentName: entry.studentName,
//                     className: entry.class,
//                     streamName: entry.stream,
//                     subjects: {}
//                   };
//                   acc.push(existingStudent);
//                 }
//                 existingStudent.subjects[entry.subjectName] = entry.marks ?? "";
//                 return acc;
//               }, []).map((row) => (
//                 <tr key={row.stdNo}>
//                   <td className="border px-4 py-2 text-gray-950">{row.stdNo}</td>
//                   <td className="border px-4 py-2 text-gray-950">{row.studentName}</td>
//                   <td className="border px-4 py-2 text-gray-950">{row.stdNo}</td>
//                   <td className="border px-4 py-2 text-gray-950">{row.className}</td>
//                   <td className="border px-4 py-2 text-gray-950">{row.streamName}</td>
                  
//                   {/* Editable Subject Fields */}
//                   {["Maths", "English", "Kiswahili", "CRE", "Chemistry"].map((subjectName) => (
//                     <td className="border px-4 py-2 text-gray-900" key={subjectName}>
//                       <input
//                         type="number"
//                         value={editedGrades[`${row.stdNo}-${subjectName}`] ?? row.subjects[subjectName] ?? ""}
//                         onChange={(e) => handleEdit(row.stdNo, subjectName, e.target.value)}
//                         className="w-16 p-1 border rounded text-gray-900"
//                       />
//                     </td>
//                   ))}

//                   {/* Total Score */}
//                   <td className="border px-4 py-2 text-blue-950">
//                     {Object.values(row.subjects).reduce((total, mark) => total + (Number(mark) || 0), 0)}
//                   </td>

//                   {/* Save Button */}
//                   <td className="border px-4 py-2 text-gray-900">
//                     <button
//                       onClick={() =>
//                         Object.keys(row.subjects).forEach((subjectName) =>
//                           handleSave(row.stdNo, subjectName)
//                         )
//                       }
//                       className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700"
//                     >
//                       Save
//                     </button>
//                   </td>
//                 </tr>
//               ))}
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
  const [grades, setGrades] = useState([]);
  const [editedGrades, setEditedGrades] = useState({});

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await axios.get("/teacher/grades");
      setGrades(response.data);
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast.error("Failed to fetch grades.");
    }
  };

  const handleEdit = (stdNo, subject, newMarks) => {
    setEditedGrades((prev) => ({
      ...prev,
      [`${stdNo}-${subject}`]: Number(newMarks), // Store changed marks only
    }));
  };

  const handleSave = async (stdNo) => {
    // Filter out only changed marks for this student
    const updates = Object.entries(editedGrades)
      .filter(([key]) => key.startsWith(`${stdNo}-`))
      .map(([key, marks]) => {
        const [, subjectName] = key.split("-");
        return { subjectName, marks };
      });

    if (updates.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    try {
      await axios.put(`/teacher/grades`, { stdNo, updates });

      toast.success("Grades updated successfully!");
      setEditedGrades((prev) =>
        Object.fromEntries(
          Object.entries(prev).filter(([key]) => !key.startsWith(`${stdNo}-`))
        )
      );
      fetchGrades(); // Refresh updated data
    } catch (error) {
      console.error("Error updating grades:", error);
      toast.error("Failed to update grades.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Grades Management</h1>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Grades</h2>
        {grades.length > 0 ? (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">UserNo</th>
                <th className="border px-4 py-2">Class</th>
                <th className="border px-4 py-2">Stream</th>
                {["Maths", "English", "Kiswahili", "CRE", "Chemistry"].map((subject) => (
                  <th key={subject} className="border px-4 py-2">{subject}</th>
                ))}
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.flatMap((grade) =>
                grade.subjects.flatMap((subject) =>
                  subject.grades.map((entry) => ({
                    ...entry,
                    subjectName: subject.subjectName,
                    key: `${grade._id}-${entry.stdNo}-${subject.subjectName}`,
                  }))
                )
              ).reduce((acc, entry) => {
                let student = acc.find((row) => row.stdNo === entry.stdNo);
                if (!student) {
                  student = {
                    stdNo: entry.stdNo,
                    studentName: entry.studentName,
                    className: entry.class,
                    streamName: entry.stream,
                    subjects: {},
                  };
                  acc.push(student);
                }
                student.subjects[entry.subjectName] = entry.marks ?? "";
                return acc;
              }, []).map((row) => (
                <tr key={row.stdNo}>
                  <td className="border px-4 py-2 text-gray-950">{row.stdNo}</td>
                  <td className="border px-4 py-2 text-gray-950">{row.studentName}</td>
                  <td className="border px-4 py-2 text-gray-950">{row.stdNo}</td>
                  <td className="border px-4 py-2 text-gray-950">{row.className}</td>
                  <td className="border px-4 py-2 text-gray-950">{row.streamName}</td>

                  {["Maths", "English", "Kiswahili", "CRE", "Chemistry"].map((subject) => (
                    <td key={subject} className="border px-4 py-2">
                      <input
                        type="number"
                        value={editedGrades[`${row.stdNo}-${subject}`] ?? row.subjects[subject] ?? ""}
                        onChange={(e) => handleEdit(row.stdNo, subject, e.target.value)}
                        className="w-16 p-1 border rounded text-gray-900"
                      />
                    </td>
                  ))}

                  <td className="border px-4 py-2 text-blue-950">
                    {Object.values(row.subjects).reduce((total, mark) => total + (Number(mark) || 0), 0)}
                  </td>

                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleSave(row.stdNo)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                  </td>
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

