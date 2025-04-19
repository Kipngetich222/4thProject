import axios from 'axios';
import React, { useState, useEffect } from 'react'

const Attendance = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});

    // useEffect(() => {
    //     // Fetch classes from API or define them here
    //     setClasses([
    //         { _id: '1', name: 'Class 1' },
    //         { _id: '2', name: 'Class 2' },
    //         // Add more classes as needed
    //     ]);
    // }, []);
    useEffect(()=>{
        axios.get("/classes")
        .then(res=>{ setClasses(res.data)})
        .catch(err=>{console.log(err)})
    })

    // useEffect(() => {
    //     if (selectedClass) {
    //         // Fetch students based on selected class from API or define them here
    //         setStudents([
    //             { _id: '1', name: 'Student 1' },
    //             { _id: '2', name: 'Student 2' },
    //             // Add more students as needed
    //         ]);
    //     } else {
    //         setStudents([]);
    //     }
    // }, [selectedClass]);

    useEffect(() => {
        if (selectedClass) {
          axios.get(`/students/${selectedClass}`)
            .then(response => setStudents(response.data))
            .catch(error => console.error("Error fetching students:", error));
        }
      }, [selectedClass]);

    // const handleAttendanceChange = (studentId, status) => {
    //     setAttendance((prevAttendance) => ({
    //         ...prevAttendance,
    //         [studentId]: status,
    //     }));
    // };
    // const handleAttendanceChange = (studentId, status) => {
    //     setAttendance(prev => ({
    //       ...prev,
    //       [studentId]: status, // Store Present/Absent for each student
    //     }));
    //   };
    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({
          ...prev,
          [studentId]: status, // Store Present/Absent for each student
        }));
      };
    // const submitAttendance = () => {
    //     // Handle attendance submission logic here
    //     console.log('Attendance submitted:', attendance);
    // };
    const submitAttendance = async () => {
        try {
          const response = await axios.post("http://localhost:5000/attendance", {
            classId: selectedClass,
            records: Object.entries(attendance).map(([studentId, status]) => ({
              studentId,
              status,
            })),
          });
    
          toast.success("Attendance submitted successfully!");
          console.log("Response:", response.data);
        } catch (error) {
          console.error("Error submitting attendance:", error);
          toast.error("Failed to submit attendance.");
        }
      };
    return (
        <div className="min-h-screen p-6 bg-gray-100">
          <h1 className="text-3xl font-bold text-blue-800 mb-6">Mark Student Attendance</h1>
    
          {/* Class Selection */}
          <label className="block mb-2">Select Class:</label>
          <select
            className="border p-2 w-full mb-4"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
            ))}
          </select>
    
          {/* Display Students */}
          {students.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Students in {selectedClass}</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Student Name</th>
                    <th className="p-2 text-center">Present</th>
                    <th className="p-2 text-center">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="border-b">
                      <td className="p-2">{student.name}</td>
                      <td className="p-2 text-center">
                        <input
                          type="radio"
                          name={`attendance-${student._id}`}
                          value="Present"
                          checked={attendance[student._id] === "Present"}
                          onChange={() => handleAttendanceChange(student._id, "Present")}
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="radio"
                          name={`attendance-${student._id}`}
                          value="Absent"
                          checked={attendance[student._id] === "Absent"}
                          onChange={() => handleAttendanceChange(student._id, "Absent")}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={submitAttendance}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Submit Attendance
              </button>
            </div>
          )}
        </div>
      );
}

export default Attendance
