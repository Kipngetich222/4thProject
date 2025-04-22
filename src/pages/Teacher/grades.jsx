import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TeacherGrades = () => {
  const [grades, setGrades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await axios.get("/teacher/grades");
      console.log("Fetched Grades:", response.data);
      setGrades(response.data);
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast.error("Failed to fetch grades.");
    }
  };

  // Helper function to get all unique student numbers from a class
  const getStudentNumbers = (subjects) => {
    if (!subjects || subjects.length === 0) return [];
    const students = new Set();
    subjects.forEach(subject => {
      subject.grades.forEach(grade => {
        students.add(grade.stdNo);
      });
    });
    return Array.from(students);
  };

  // Helper function to get a student's mark for a specific subject
  const getStudentMark = (subjects, subjectName, stdNo) => {
    const subject = subjects.find(sub => sub.subjectName === subjectName);
    if (!subject) return 0; // Return 0 for subjects that might not exist
    const grade = subject.grades.find(g => g.stdNo === stdNo);
    return grade ? grade.marks : 0;
  };

  // Helper function to calculate total marks for a student
  const calculateTotalMarks = (subjects, stdNo) => {
    let total = 0;
    subjects.forEach(subject => {
      const grade = subject.grades.find(g => g.stdNo === stdNo);
      if (grade) {
        total += grade.marks;
      }
    });
    return total;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Grades Management</h1>
      <button
        onClick={() => console.log("Add Grade Button Clicked")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Grade
      </button>

      {grades.map((classData) => {
        const studentNumbers = getStudentNumbers(classData.subjects);
        
        return (
          <div key={classData._id} className="bg-white p-4 rounded-lg shadow-md mb-6 overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {classData.class} - {classData.term} {classData.academicYear}  {classData.exam}
            </h2>
            
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Student No</th>
                  <th className="px-4 py-2">Maths</th>
                  <th className="px-4 py-2">English</th>
                  <th className="px-4 py-2">Kiswahili</th>
                  <th className="px-4 py-2">CRE</th>
                  <th className="px-4 py-2">Physics</th>
                  <th className="px-4 py-2">Chemistry</th>
                  <th className="px-4 py-2 bg-blue-100">Total</th>
                </tr>
              </thead>
              <tbody>
                {studentNumbers.map((stdNo) => {
                  const totalMarks = calculateTotalMarks(classData.subjects, stdNo);
                  
                  return (
                    <tr key={`${classData._id}-${stdNo}`} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{stdNo}</td>
                      <td className="border px-4 py-2">
                        {getStudentMark(classData.subjects, "Maths", stdNo)}
                      </td>
                      <td className="border px-4 py-2">
                        {getStudentMark(classData.subjects, "English", stdNo)}
                      </td>
                      <td className="border px-4 py-2">
                        {getStudentMark(classData.subjects, "Kiswahili", stdNo)}
                      </td>
                      <td className="border px-4 py-2">
                        {getStudentMark(classData.subjects, "CRE", stdNo)}
                      </td>
                      <td className="border px-4 py-2">
                        {getStudentMark(classData.subjects, "Physics", stdNo)}
                      </td>
                      <td className="border px-4 py-2">
                        {getStudentMark(classData.subjects, "Chemistry", stdNo)}
                      </td>
                      <td className="border px-4 py-2 bg-blue-50 font-semibold">
                        {totalMarks}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {grades.length === 0 && (
        <p className="text-gray-600">No grades found.</p>
      )}
    </div>
  );
};

export default TeacherGrades;
