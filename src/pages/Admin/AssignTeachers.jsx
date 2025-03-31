import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // Fetch teachers and classes
    axios.get("/api/teachers").then((res) => setTeachers(res.data));
    axios.get("/api/classes").then((res) => setClasses(res.data));
  }, []);

  const handleAssign = async () => {
    if (!selectedTeacher || assignments.length === 0) {
      alert("Please select a teacher and at least one subject-class pair.");
      return;
    }

    try {
      const response = await axios.post("/api/assign-teacher", {
        teacherId: selectedTeacher,
        subjects: assignments,
      });

      alert(response.data.message);
    } catch (error) {
      alert("Error assigning teacher");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Assign Teacher to Classes</h2>

      <label>Teacher:</label>
      <select onChange={(e) => setSelectedTeacher(e.target.value)}>
        <option value="">Select Teacher</option>
        {teachers.map((teacher) => (
          <option key={teacher._id} value={teacher._id}>
            {teacher.userNo} - {teacher.department}
          </option>
        ))}
      </select>

      <h3>Select Subjects and Classes</h3>
      {teachers
        .find((t) => t._id === selectedTeacher)?.subjects.map((subject, index) => (
          <div key={index}>
            <strong>{subject}</strong>
            <select
              multiple
              onChange={(e) => {
                const selectedClasses = Array.from(e.target.selectedOptions).map(
                  (opt) => opt.value
                );

                setAssignments((prev) =>
                  prev.some((s) => s.subject === subject)
                    ? prev.map((s) =>
                        s.subject === subject ? { ...s, classes: selectedClasses } : s
                      )
                    : [...prev, { subject, classes: selectedClasses }]
                );
              }}
            >
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>
        ))}

      <button onClick={handleAssign}>Assign Teacher</button>
    </div>
  );
};

export default AssignTeacher;
