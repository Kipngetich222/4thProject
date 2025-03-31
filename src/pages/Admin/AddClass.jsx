import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddClassForm = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    class: "",
    stream: "",
    ClassTeacherNo: "",
  });

  useEffect(() => {
    // const fetchTeachers = async () => {
    //   try {
    //     const response = await axios.get("/api/teachers");
    //     if (!response.ok) throw new Error("Failed to fetch teachers");
    //     const data = await response.json();

    //     if (Array.isArray(data.teachersList)) {  // Adjusted key
    //       setTeachers(data.teachersList);  // Adjusted key
    //     } else {
    //       console.error("Unexpected API response:", data);
    //       setTeachers([]);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching teachers:", error);
    //     setTeachers([]);
    //   }
    // };
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("/api/teachers");
        const data = response.data; // ✅ Axios stores response data here

        if (Array.isArray(data.teachersList)) {  // ✅ Use teachersList key
          setTeachers(data.teachersList);
        } else {
          console.error("Unexpected API response:", data);
          setTeachers([]);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setTeachers([]);
      }
    };

    fetchTeachers();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/classes", formData);
      if (response.status === 201) {
        toast.success("Class added successfully!");
        setFormData({ class: "", stream: "", ClassTeacherNo: "" });
      }
      if(response.error){
        toast.error(response.message)
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.error("Registration error:", error.response.data.error);
        toast.error(error.response.data.error); // Show backend error message
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">Add New Class</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        {/* Class */}
        {/* <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Class</span>
          </label>
          <input
            type="text"
            name="class"
            value={formData.class}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter Class Name"
            required
          />
        </div> */}
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Grade</span>
          </label>
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Grade</option>
            {Array.from({ length: 9 }, (_, i) => (
              <option key={i + 1} value={`Grade ${i + 1}`}>
                Grade {i + 1}
              </option>
            ))}
          </select>
        </div>


        {/* Stream */}
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Stream</span>
          </label>
          <input
            type="text"
            name="stream"
            value={formData.stream}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter Stream Name"
            required
          />
        </div>

        {/* Teacher Selection */}
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Class Teacher</span>
          </label>
          {/* <select
            name="ClassTeacherNo"
            value={formData.ClassTeacherNo}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) =>
              teacher.userNo ? (
                <option key={teacher.userNo} value={teacher.userNo}>
                 {"name "+teacher. fullName} : {"teacherNo " +teacher.userNo} : {"department " +teacher.department} - {"subjects "+teacher.subjects}
                </option>
              ) : null
            )}
          </select> */}
          <select
            name="ClassTeacherNo"
            value={formData.ClassTeacherNo}
            onChange={handleChange}
            className="select select-bordered w-full text-lg"
            required
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) =>
              teacher.userNo ? (
                <option key={teacher.userNo} value={teacher.userNo} className="text-gray-700">
                  {`${teacher.fullName} | No: ${teacher.userNo} | ${teacher.department} | Subjects: ${teacher.subjects.join(", ")}`}
                </option>
              ) : null
            )}
          </select>

        </div>

        {/* Submit Button */}
        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary w-full">
            Add Class
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClassForm;
