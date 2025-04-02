import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function TeacherForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userNo: "",
    department: "",
    subjects: [],
    contactNo: "", // ✅ Updated variable
  });

  // ✅ Fetch userNo from localStorage (if applicable)
  useEffect(() => {
    const storedUserNo = localStorage.getItem("NewuserNo");
    if (storedUserNo) {
      setFormData((prev) => ({ ...prev, userNo: storedUserNo }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      subjects: checked
        ? [...prev.subjects, value]
        : prev.subjects.filter((subject) => subject !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/admin/teacher", formData);

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Teacher added successfully!");
        navigate('/admin')
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Submission failed.");
    }
  };

  // return (
  //   <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
  //     <h2 className="text-2xl font-bold mb-4 text-center">Add Teacher</h2>
  //     <form onSubmit={handleSubmit} className="space-y-4">

  //       {/* User Number (Readonly, fetched from localStorage) */}
  //       <div>
  //         <label className="block text-gray-700">User No</label>
  //         <input
  //           type="text"
  //           name="userNo"
  //           value={formData.userNo}
  //           readOnly
  //           className="w-full mt-1 p-2 border rounded-md bg-gray-100"
  //         />
  //       </div>

  //       {/* Department */}
  //       <div>
  //         <label className="block text-gray-700">Department</label>
  //         <select
  //           name="department"
  //           value={formData.department}
  //           onChange={handleChange}
  //           className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
  //           required
  //         >
  //           <option value="">Select Department</option>
  //           <option value="Science">Science</option>
  //           <option value="Mathematics">Mathematics</option>
  //           <option value="Languages">Languages</option>
  //         </select>
  //       </div>

  //       {/* Subjects (Checkboxes) */}
  //       <div>
  //         <label className="block text-gray-700">Subjects</label>
  //         <div className="flex gap-4 mt-1">
  //           {["Math", "English", "Physics"].map((subject) => (
  //             <label key={subject} className="flex items-center space-x-2">
  //               <input
  //                 type="checkbox"
  //                 value={subject}
  //                 checked={formData.subjects.includes(subject)}
  //                 onChange={handleSubjectChange}
  //                 className="rounded border-gray-300 focus:ring focus:ring-blue-300"
  //               />
  //               <span>{subject}</span>
  //             </label>
  //           ))}
  //         </div>
  //       </div>

  //       {/* Contact Number */}
  //       <div>
  //         <label className="block text-gray-700">Contact Number</label>
  //         <input
  //           type="tel"
  //           name="contactNo" // ✅ Updated variable
  //           value={formData.contactNo}
  //           onChange={handleChange}
  //           className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
  //           required
  //         />
  //       </div>

  //       {/* Submit Button */}
  //       <button
  //         type="submit"
  //         className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
  //       >
  //         Submit
  //       </button>
  //     </form>
  //   </div>
  // );


  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-black">Add Teacher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* User Number (Readonly, fetched from localStorage) */}
        <div>
          <label className="block text-gray-700">User No</label>
          <input
            type="text"
            name="userNo"
            value={formData.userNo}
            readOnly
            className="w-full mt-1 p-2 border border-gray-400 rounded-md bg-gray-100 text-gray-700 font-medium"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-gray-700">Department</label>
          {/* <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-400 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Select Department</option>
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Languages">Languages</option>
          </select> */}
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-500 rounded-md bg-white text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-300"
            required
          >
            <option value="" disabled hidden>Select Department</option>
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Languages">Languages</option>
          </select>

        </div>

        {/* Subjects (Checkboxes) */}
        <div>
          <label className="block text-gray-700">Subjects</label>
          <div className="flex gap-4 mt-1">
            {["Math", "English", "Physics","Chemistry","Kiswahili","CRE"].map((subject) => (
              <label key={subject} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={subject}
                  checked={formData.subjects.includes(subject)}
                  onChange={handleSubjectChange}
                  className="rounded border-gray-400 focus:ring focus:ring-blue-300"
                />
                <span className="text-gray-800">{subject}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Contact Number</label>
          <input
            type="tel"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            placeholder="Enter contact number"
            className="w-full mt-1 p-3 border border-gray-500 rounded-md bg-white text-gray-800 text-lg focus:border-blue-500 focus:ring focus:ring-blue-300 placeholder-gray-600"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
