<<<<<<< HEAD
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddStudent() {
  const [formData, setFormData] = useState({
    userNo: "",
    StdClass: "", // Changed from "class" to "studentClass"
    stream: "",
    subjects: [],
    enrollmentDate: "",
    parentContact: "",
    performance: "",
  });

  // Handle text and select input changes
=======
// import { useState } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";

// export default function StudentForm() {
//   const location = useLocation();
//   const userNoFromState = location.state?.userNo || ""; // Get userNo from previous page

//   const [formData, setFormData] = useState({
//     userNo: userNoFromState,
//     stdClass: "",  // ✅ Match this with the input name
//     stream: "",
//     subjects: [],
//   });

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle subject checkboxes
//   const handleSubjectChange = (e) => {
//     const { value, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       subjects: checked
//         ? [...prev.subjects, value]
//         : prev.subjects.filter((subject) => subject !== value),
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/admin/student", formData);
//       if (!response.data.error) {
//         toast.success("Student added successfully!");
//         setFormData({ userNo: userNoFromState, stdClass: "", stream: "", subjects: [] });
//       } else {
//         toast.error(response.data.error);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Submission failed");
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
//       <h2 className="text-2xl font-bold mb-4 text-center">Add Student</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
        
//         {/* User Number (Read-only) */}
//         <div>
//           <label className="block text-gray-700">User No</label>
//           <input
//             type="text"
//             name="userNo"
//             value={formData.userNo}
//             readOnly
//             className="w-full mt-1 p-2 border rounded-md bg-gray-200 cursor-not-allowed"
//           />
//         </div>

//         {/* Class Selection */}
//         <div>
//           <label className="block text-gray-700">Class</label>
//           <select
//             name="stdClass"  // ✅ Corrected
//             value={formData.stdClass}
//             onChange={handleChange}
//             className="w-full mt-1 p-2 border rounded-md"
//             required
//           >
//             <option value="">Select Class</option>
//             <option value="Form 1">Form 1</option>
//             <option value="Form 2">Form 2</option>
//             <option value="Form 3">Form 3</option>
//             <option value="Form 4">Form 4</option>
//           </select>
//         </div>

//         {/* Stream Selection */}
//         <div>
//           <label className="block text-gray-700">Stream</label>
//           <select
//             name="stream"
//             value={formData.stream}
//             onChange={handleChange}
//             className="w-full mt-1 p-2 border rounded-md"
//             required
//           >
//             <option value="">Select Stream</option>
//             <option value="North">North</option>
//             <option value="South">South</option>
//             <option value="East">East</option>
//             <option value="West">West</option>
//           </select>
//         </div>

//         {/* Subjects (Checkboxes) */}
//         <div>
//           <label className="block text-gray-700">Subjects</label>
//           <div className="grid grid-cols-2 gap-4 mt-1">
//             {["Math", "English", "Physics", "Biology", "Chemistry"].map((subject) => (
//               <label key={subject} className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   value={subject}
//                   checked={formData.subjects.includes(subject)}
//                   onChange={handleSubjectChange}
//                   className="rounded border-gray-300"
//                 />
//                 <span>{subject}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function StudentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const userNoFromState = location.state?.userNo || ""; // Get userNo from previous page

  const [formData, setFormData] = useState({
    userNo: userNoFromState,
    stdClass: "",
    stream: "",
    subjects: [],
  });

  // Handle input change
>>>>>>> origin/admin
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

<<<<<<< HEAD
  // Handle changes for the "subjects" checkboxes
=======
  // Handle subject checkboxes
>>>>>>> origin/admin
  const handleSubjectChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      subjects: checked
        ? [...prev.subjects, value]
        : prev.subjects.filter((subject) => subject !== value),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/admin/student", formData);

<<<<<<< HEAD
      if (response.status === 201) {
        toast.success("Student details submitted successfully!");
        setFormData({
          userNo: "",
          StdClass: "",
          stream: "",
          subjects: [],
          enrollmentDate: "",
          parentContact: "",
          performance: "",
        });
      } else {
        toast.error("Failed to submit student details.");
=======
      if (!response.data.error) {
        toast.success("Student added successfully!");

        // ✅ Navigate to /admin/parent while passing userNo
        navigate("/admin/parent", { state: { userNo: formData.userNo } });

        // ✅ Reset form
        setFormData({ userNo: userNoFromState, stdClass: "", stream: "", subjects: [] });
      } else {
        toast.error(response.data.error);
>>>>>>> origin/admin
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Submission failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
<<<<<<< HEAD
      <h2 className="text-2xl font-bold mb-4 text-center">Add Student Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* User Number */}
=======
      <h2 className="text-2xl font-bold mb-4 text-center">Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* User Number (Read-only) */}
>>>>>>> origin/admin
        <div>
          <label className="block text-gray-700">User No</label>
          <input
            type="text"
            name="userNo"
            value={formData.userNo}
<<<<<<< HEAD
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Class */}
        <div>
          <label className="block text-gray-700">Class</label>
          <input
            type="text"
            name="StdClass" // Updated name
            value={formData.StdClass}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="E.g., Grade 10"
            required
          />
        </div>

        {/* Stream */}
        <div>
          <label className="block text-gray-700">Stream</label>
          <input
            type="text"
            name="stream"
            value={formData.stream}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="E.g., Science"
          />
        </div>

        {/* Subjects */}
        <div>
          <label className="block text-gray-700">Subjects</label>
          <div className="flex gap-4 mt-1">
            {["Math", "English", "Physics", "History"].map((subject) => (
=======
            readOnly
            className="w-full mt-1 p-2 border rounded-md bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Class Selection */}
        <div>
          <label className="block text-gray-700">Class</label>
          <select
            name="stdClass"
            value={formData.stdClass}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
            required
          >
            <option value="">Select Class</option>
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
          </select>
        </div>

        {/* Stream Selection */}
        <div>
          <label className="block text-gray-700">Stream</label>
          <select
            name="stream"
            value={formData.stream}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
            required
          >
            <option value="">Select Stream</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
        </div>

        {/* Subjects (Checkboxes) */}
        <div>
          <label className="block text-gray-700">Subjects</label>
          <div className="grid grid-cols-2 gap-4 mt-1">
            {["Math", "English", "Physics", "Biology", "Chemistry"].map((subject) => (
>>>>>>> origin/admin
              <label key={subject} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={subject}
                  checked={formData.subjects.includes(subject)}
                  onChange={handleSubjectChange}
<<<<<<< HEAD
                  className="rounded border-gray-300 focus:ring focus:ring-blue-300"
=======
                  className="rounded border-gray-300"
>>>>>>> origin/admin
                />
                <span>{subject}</span>
              </label>
            ))}
          </div>
        </div>

<<<<<<< HEAD
        {/* Enrollment Date */}
        <div>
          <label className="block text-gray-700">Enrollment Date</label>
          <input
            type="date"
            name="enrollmentDate"
            value={formData.enrollmentDate}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Parent Contact */}
        <div>
          <label className="block text-gray-700">Parent Contact</label>
          <input
            type="tel"
            name="parentContact"
            value={formData.parentContact}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="E.g., +1234567890"
            required
          />
        </div>

        {/* Performance */}
        <div>
          <label className="block text-gray-700">Performance Remarks</label>
          <textarea
            name="performance"
            value={formData.performance}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
            placeholder="Optional remarks on student performance"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
=======
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
>>>>>>> origin/admin
        >
          Submit
        </button>
      </form>
    </div>
  );
}
<<<<<<< HEAD

=======
>>>>>>> origin/admin
