import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const ExamForm = () => {
  const [examName, setExamName] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);

  const availableClasses = ["Form 1", "Form 2", "Form 3", "Form 4"]; // Modify as needed

  const handleClassChange = (e) => {
    const { value, checked } = e.target;
    setSelectedClasses((prev) =>
      checked ? [...prev, value] : prev.filter((cls) => cls !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!examName) {
      toast.error("Please enter an exam name.");
      return;
    }
    if (selectedClasses.length === 0) {
      toast.error("Please select at least one class.");
      return;
    }

    try {
      const response = await axios.post("/admin/createexam", {
        exam: examName,
        classes: selectedClasses,
      });

      if (response.status === 201) {
        toast.success("Exam created successfully!");
        setExamName("");
        setSelectedClasses([]);
      } else {
        toast.error(response.data.message || "Error creating exam.");
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      toast.error(error.response?.data?.message || "Failed to create exam.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Exam</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Exam Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Exam Name</label>
          <input
            type="text"
            name="exam"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="w-full input input-bordered"
            placeholder="e.g., Midterm Exam, Endterm Exam"
            required
          />
        </div>

        {/* Class Selection */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Select Classes</label>
          <div className="grid grid-cols-2 gap-2">
            {availableClasses.map((cls) => (
              <label key={cls} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={cls}
                  checked={selectedClasses.includes(cls)}
                  onChange={handleClassChange}
                  className="checkbox checkbox-primary"
                />
                <span className="text-gray-800">{cls}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all text-lg font-semibold"
        >
          Create Exam
        </button>
      </form>
    </div>
  );
};

export default ExamForm;
