
// import axios from "axios";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// const SessionForm = () => {


// const [session, setSession] = useState({
//     academicYear: new Date().getFullYear().toString(), // Auto-fill with current year
//     term: "",
//     startDate: "",
//     endDate: "",
//   });

//   const handleChange = (e) => {
//     setSession({ ...session, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const response = await axios.post("/admin/createsession", {
//         academicYear,
//         term,
//         startDate,
//         endDate
//       });

//       const data = await response.json();
      
//       if (response.ok) {
//         toast.success("Session created successfully!");
//         setSession({
//           academicYear: new Date().getFullYear().toString(),
//           term: "Term 1",
//           startDate: "",
//           endDate: "",
//         });
//       } else {
//         (`Error: ${data.message}`);
//         toast.error(data.error);
//       }
//     } catch (error) {
//       console.error("Error creating session:", error);
//       toast.error("Failed to create session.");
//     }
//   };

//     return (
//         <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Set Academic Session</h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Academic Year - Auto-fills with Current Year */}
//                 <div>
//                     <label className="block text-gray-700 font-semibold mb-1">Academic Year</label>
//                     <input
//                         type="text"
//                         name="academicYear"
//                         value={session.academicYear}
//                         onChange={handleChange}
//                         className="w-full p-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500 text-lg text-black"
//                         required
//                     />
//                 </div>

//                 {/* Term Selection */}
//                 <div>
//                     <label className="block text-gray-700 font-semibold mb-1">Term</label>
//                     <select
//                         name="term"
//                         value={session.term}
//                         onChange={handleChange}
//                         className="w-full p-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 text-lg text-black"
//                     >
//                         <option value="Term 1">Term 1</option>
//                         <option value="Term 2">Term 2</option>
//                         <option value="Term 3">Term 3</option>
//                     </select>
//                 </div>

//                 {/* Start & End Date */}
//                 <div className="flex gap-4">
//                     <div className="w-1/2">
//                         <label className="block text-gray-700 font-semibold mb-1">Start Date</label>
//                         <input
//                             type="date"
//                             name="startDate"
//                             value={session.startDate}
//                             onChange={handleChange}
//                             className="w-full input input-bordered"
//                             required
//                         />

//                     </div>
//                     <div className="w-1/2">
//                         <label className="block text-gray-700 font-semibold mb-1">End Date</label>
//                         <input
//                             type="date"
//                             name="endDate"
//                             value={session.startDate}
//                             onChange={handleChange}
//                             className="w-full input input-bordered"
//                             required
//                         />

//                     </div>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                     type="submit"
//                     className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all text-lg font-semibold"
//                 >
//                     Save Session
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default SessionForm;


import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const SessionForm = () => {
  const [session, setSession] = useState({
    academicYear: new Date().getFullYear().toString(), // Auto-fill with current year
    term: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setSession({ ...session, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/admin/createsession", session);

      if (response.status === 201) {
        toast.success("Session created successfully!");
        setSession({
          academicYear: new Date().getFullYear().toString(),
          term: "",
          startDate: "",
          endDate: "",
        });
      } else {
        toast.error("Error creating session.");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error(error.response?.data?.message || "Failed to create session.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Set Academic Session</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Academic Year - Auto-fills with Current Year */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Academic Year</label>
          <input
            type="text"
            name="academicYear"
            value={session.academicYear}
            onChange={handleChange}
            className="w-full p-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500 text-lg text-black"
            required
          />
        </div>

        {/* Term Selection */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Term</label>
          <select
            name="term"
            value={session.term}
            onChange={handleChange}
            className="w-full p-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 text-lg text-black"
            required
          >
            <option value="">Select Term</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>

        {/* Start & End Date */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={session.startDate}
              onChange={handleChange}
              className="w-full input input-bordered"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={session.endDate}  // Fixed mistake here
              onChange={handleChange}
              className="w-full input input-bordered"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all text-lg font-semibold"
        >
          Save Session
        </button>
      </form>
    </div>
  );
};

export default SessionForm;
