// import { useState, useEffect } from "react";
// import axios from "axios";

// const EnterGrades = () => {
//   const [academicYear, setAcademicYear] = useState(new Date().getFullYear());
//   const [className, setClassName] = useState("");
//   const [stream, setStream] = useState("");
//   const [term, setTerm] = useState("Term 1");
//   const [exam, setExam] = useState("");
//   const [subject, setSubject] = useState("");
//   const [students, setStudents] = useState([]);
//   const [grades, setGrades] = useState({});

//   // Fetch students in the teacher's class
//   useEffect(() => {
//     if (className && stream) {
//       axios
//         .get(`/api/students?class=${className}&stream=${stream}`)
//         .then((response) => setStudents(response.data))
//         .catch((error) => console.error("Error fetching students:", error));
//     }
//   }, [className, stream]);

//   // Handle marks input
//   const handleGradeChange = (studentId, value) => {
//     setGrades((prev) => ({ ...prev, [studentId]: value }));
//   };

//   // Submit grades
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/api/grades", {
//         academicYear,
//         class: className,
//         stream,
//         term,
//         exam,
//         subject,
//         grades: Object.entries(grades).map(([studentId, marks]) => ({
//           studentId,
//           marks: parseInt(marks),
//         })),
//       });
//       alert("✅ Grades submitted successfully!");
//       setGrades({});
//     } catch (error) {
//       console.error("❌ Error submitting grades:", error);
//       alert("Failed to submit grades!");
//     }
//   };

//   return (
//     <div>
//       <h2>Enter Student Grades</h2>
//       <form onSubmit={handleSubmit}>
//         <label>Academic Year:</label>
//         <input type="text" value={academicYear} disabled />

//         <label>Class:</label>
//         <input type="text" value={className} onChange={(e) => setClassName(e.target.value)} required />

//         <label>Stream:</label>
//         <input type="text" value={stream} onChange={(e) => setStream(e.target.value)} required />

//         <label>Term:</label>
//         <select value={term} onChange={(e) => setTerm(e.target.value)}>
//           <option>Term 1</option>
//           <option>Term 2</option>
//           <option>Term 3</option>
//         </select>

//         <label>Exam Type:</label>
//         <input type="text" value={exam} onChange={(e) => setExam(e.target.value)} required />

//         <label>Subject:</label>
//         <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />

//         <h3>Students</h3>
//         {students.length === 0 ? <p>No students found.</p> : students.map((student) => (
//           <div key={student._id}>
//             <label>{student.fname} {student.lname}:</label>
//             <input
//               type="number"
//               min="0"
//               max="100"
//               value={grades[student._id] || ""}
//               onChange={(e) => handleGradeChange(student._id, e.target.value)}
//               required
//             />
//           </div>
//         ))}

//         <button type="submit">Submit Grades</button>
//       </form>
//     </div>
//   );
// };

// export default EnterGrades;
