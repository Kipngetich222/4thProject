// import React, { useState, useEffect } from 'react';
// import './grades.css';

// const Grades = () => {
//   const [grades, setGrades] = useState([]);
//   const [isTeacher, setIsTeacher] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is a teacher
//     const userRole = localStorage.getItem('role');
//     setIsTeacher(userRole === 'teacher');
    
//     // Fetch grades data
//     fetchGrades();
//   }, []);

//   const fetchGrades = async () => {
//     try {
//       // TODO: Replace with your actual API endpoint
//       const response = await fetch('/api/grades');
//       const data = await response.json();
//       setGrades(data);
//     } catch (error) {
//       console.error('Error fetching grades:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleMarkChange = (gradeId, stdNo, subjectName, newMark) => {
//     setGrades((prevGrades) =>
//       prevGrades.map((grade) => {
//         if (grade._id !== gradeId) return grade;
//         const updatedSubjects = grade.subjects.map((subject) => {
//           if (subject.subjectName !== subjectName) return subject;
//           const updatedGrades = subject.grades.map((g) =>
//             g.stdNo === stdNo ? { ...g, marks: parseInt(newMark) || 0 } : g
//           );
//           return { ...subject, grades: updatedGrades };
//         });
//         return { ...grade, subjects: updatedSubjects };
//       })
//     );
//   };
  
//   const handleGradeChange = async (studentId, newGrade) => {
//     if (!isTeacher) return;

//     try {
//       // TODO: Replace with your actual API endpoint
//       const response = await fetch(`/api/grades/${studentId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ grade: newGrade }),
//       });

//       if (response.ok) {
//         // Update local state
//         setGrades(grades.map(grade => 
//           grade.studentId === studentId 
//             ? { ...grade, value: newGrade }
//             : grade
//         ));
//       }
//     } catch (error) {
//       console.error('Error updating grade:', error);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="grades-container">
//       <h2>Student Grades</h2>
//       <div className="grades-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Student Name</th>
//               <th>Subject</th>
//               <th>Grade</th>
//               {isTeacher && <th>Actions</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {grades.map((grade) => (
//               <tr key={grade.id}>
//                 <td>{grade.studentName}</td>
//                 <td>{grade.subject}</td>
//                 <td>
//                   {isTeacher ? (
//                     <input
//                       type="number"
//                       min="0"
//                       max="100"
//                       value={grade.value}
//                       onChange={(e) => handleGradeChange(grade.studentId, e.target.value)}
//                     />
//                   ) : (
//                     grade.value
//                   )}
//                 </td>
//                 {isTeacher && (
//                   <td>
//                     <button 
//                       onClick={() => handleGradeChange(grade.studentId, grade.value)}
//                       className="save-btn"
//                     >
//                       Save
//                     </button>
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Grades; 

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [editing, setEditing] = useState({}); // { `${gradeId}-${subject}-${stdNo}`: true }

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

  const getStudentNumbers = (subjects) => {
    const students = new Set();
    subjects.forEach((subject) => {
      subject.grades.forEach((grade) => {
        students.add(grade.stdNo);
      });
    });
    return Array.from(students);
  };

  const getStudentMark = (subjects, subjectName, stdNo) => {
    const subject = subjects.find((s) => s.subjectName === subjectName);
    if (!subject) return 0;
    const grade = subject.grades.find((g) => g.stdNo === stdNo);
    return grade ? grade.marks : 0;
  };

  const handleEdit = (gradeId, subject, stdNo, value) => {
    setGrades((prev) =>
      prev.map((g) => {
        if (g._id !== gradeId) return g;
        return {
          ...g,
          subjects: g.subjects.map((s) => {
            if (s.subjectName !== subject) return s;
            return {
              ...s,
              grades: s.grades.map((gr) =>
                gr.stdNo === stdNo ? { ...gr, marks: Number(value) } : gr
              ),
            };
          }),
        };
      })
    );
  };

  const handleSave = async (gradeId, subject, stdNo, marks) => {
    try {
      await axios.put(`/teacher/grades/${gradeId}/update`, {
        subject,
        stdNo,
        marks,
      });
      toast.success("Mark updated");
      setEditing((prev) => {
        const copy = { ...prev };
        delete copy[`${gradeId}-${subject}-${stdNo}`];
        return copy;
      });
    } catch (err) {
      toast.error("Failed to update mark");
    }
  };

  const isEditing = (gradeId, subject, stdNo) =>
    editing[`${gradeId}-${subject}-${stdNo}`];

  const setCellEditing = (gradeId, subject, stdNo, value) =>
    setEditing((prev) => ({
      ...prev,
      [`${gradeId}-${subject}-${stdNo}`]: value,
    }));

  const calculateTotalMarks = (subjects, stdNo) => {
    return subjects.reduce((acc, subject) => {
      const grade = subject.grades.find((g) => g.stdNo === stdNo);
      return acc + (grade ? grade.marks : 0);
    }, 0);
  };

  const subjectsList = ["Maths", "English", "Kiswahili", "CRE", "Physics", "Chemistry"];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Grades Management
      </h1>

      {grades.map((grade) => {
        const studentNos = getStudentNumbers(grade.subjects);

        return (
          <div
            key={grade._id}
            className="bg-white p-4 rounded-lg shadow mb-6 overflow-x-auto"
          >
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              {grade.class} - {grade.term} {grade.academicYear} | {grade.exam}
            </h2>

            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-3 py-2 border">Student No</th>
                  {subjectsList.map((sub) => (
                    <th key={sub} className="px-3 py-2 border">{sub}</th>
                  ))}
                  <th className="px-3 py-2 border bg-blue-50">Total</th>
                </tr>
              </thead>
              <tbody>
                {studentNos.map((stdNo) => (
                  <tr key={stdNo} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{stdNo}</td>
                    {subjectsList.map((sub) => {
                      const value = getStudentMark(grade.subjects, sub, stdNo);
                      const key = `${grade._id}-${sub}-${stdNo}`;
                      return (
                        <td className="border px-3 py-2" key={key}>
                          {isEditing(grade._id, sub, stdNo) ? (
                            <input
                              type="number"
                              value={value}
                              onChange={(e) =>
                                handleEdit(grade._id, sub, stdNo, e.target.value)
                              }
                              onBlur={() =>
                                handleSave(grade._id, sub, stdNo, value)
                              }
                              className="w-16 border px-2 py-1 rounded"
                              autoFocus
                            />
                          ) : (
                            <span
                              className="cursor-pointer"
                              onClick={() =>
                                setCellEditing(grade._id, sub, stdNo, true)
                              }
                            >
                              {value}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="border px-3 py-2 font-semibold bg-blue-50">
                      {calculateTotalMarks(grade.subjects, stdNo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default Grades;
