import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateAssignment = () => {
  const navigate = useNavigate();
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    dueDate: "",
    courseId: "",
    assignmentType: "",
    maxPoints: "",
    pointsEarned: "",
    grade: "",
    status: "",
    comments: "",
    course: {
      id: "",
      name: "",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/assignments", assignmentData);
      toast.success("Assignment created successfully!");
      navigate("/admin/assignments");
    } catch (error) {
      console.error("Assignment creation failed:", error);
      toast.error(error.response?.data?.error || "Failed to create assignment");
    }
  };

  return (
    <div>
      {/* Render your form here */}
    </div>
  );
};

export default CreateAssignment; 