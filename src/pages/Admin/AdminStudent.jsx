import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
//import axios from "axios";
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

  const [classes, setClasses] = useState([]); // Store classes fetched from DB
  const [streams, setStreams] = useState([]); // Store streams

  // Fetch classes and streams from the database
  // useEffect(() => {
    
  //   // };
  //   const fetchClasses = async () => {
  //     try {
  //       const response = await axios.get("/api/classes");
  //       console.log("Fetched Classes:", response.data); // Debugging
        
  //       if (!Array.isArray(response.data.classes)) {
  //         throw new Error("Fetched data is not an array");
  //       }
  //       const uniqueClasses = [...new Set(response.data.classes.map(cls => cls.class))];
  //       console.log("Unique class", uniqueClasses)
  //       setClasses(uniqueClasses); // ✅ Extract the correct array

  //       const uniqueStreams = [...new Set(response.data.classes.map(cls => cls.stream))];

  //       setStreams(uniqueStreams);
  //     } catch (error) {
  //       console.error("Error fetching classes:", error.response ? error.response.data : error.message);
  //     }
  //   };



  //   fetchClasses();
  // }, []);
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("/api/classes");
        console.log("Fetched Classes:", response.data); // Debugging
  
        if (!Array.isArray(response.data.classes)) {
          throw new Error("Fetched data is not an array");
        }
  
        // Sort classes alphabetically or numerically
        const uniqueClasses = [...new Set(response.data.classes.map(cls => cls.class))];
  
        // Sort classes in ascending order
        uniqueClasses.sort((a, b) => a.localeCompare(b)); // This sorts alphabetically
  
        console.log("Unique sorted classes", uniqueClasses);
        setClasses(uniqueClasses);
  
        // Sorting streams in ascending order
        const uniqueStreams = [...new Set(response.data.classes.map(cls => cls.stream))];
        uniqueStreams.sort((a, b) => a.localeCompare(b)); // Sorting streams alphabetically
        setStreams(uniqueStreams);
      } catch (error) {
        console.error("Error fetching classes:", error.response ? error.response.data : error.message);
      }
    };
  
    fetchClasses();
  }, []);
  

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle subject checkboxes
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

      if (!response.data.error) {
        toast.success("Student added successfully!");

        // ✅ Navigate to /admin/parent while passing userNo
        navigate("/admin/parent", { state: { userNo: formData.userNo } });

        // ✅ Reset form
        setFormData({ userNo: userNoFromState, stdClass: "", stream: "", subjects: [] });
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Submission failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* User Number (Read-only) */}
        <div>
          <label className="block text-gray-700">User No</label>
          <input
            type="text"
            name="userNo"
            value={formData.userNo}
            readOnly
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-gray-200 cursor-not-allowed text-gray-900"
          />
        </div>

        {/* Class Selection */}
        <div>
          <label className="block text-gray-700">Class</label>
          {/* <select
            name="stdClass"
            value={formData.stdClass}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            required
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls.class}>{cls.class}</option>
            ))}
          </select> */}
          <select
  name="stdClass"
  value={formData.stdClass}
  onChange={handleChange}
  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
  required
>
  <option value="">Select Class</option>
  {classes.map((cls, index) => (
    <option key={index} value={cls}>{cls}</option>
  ))}
</select>

        </div>

        {/* Stream Selection */}
        

        <div>
          <label className="block text-gray-700">Stream</label>
          <select
            name="stream"
            value={formData.stream}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            required
          >
            <option value="">Select Stream</option>
            {streams.map((stream, index) => (
              <option key={index} value={stream}>{stream}</option>
            ))}
          </select>
        </div>


        {/* Subjects (Checkboxes) */}
        <div>
          <label className="block text-gray-700">Subjects</label>
          <div className="grid grid-cols-2 gap-4 mt-1">
            {["Math", "English", "Physics", "Biology", "Chemistry"].map((subject) => (
              <label key={subject} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  value={subject}
                  checked={formData.subjects.includes(subject)}
                  onChange={handleSubjectChange}
                  className="w-5 h-5 rounded border-2 border-gray-400 focus:ring-2 focus:ring-blue-500 hover:border-blue-500"
                />
                <span className="text-gray-800 font-medium">{subject}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

