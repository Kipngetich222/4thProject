import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/course.js";
import User from "../models/user.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the script if MongoDB connection fails
  });

// Sample data
const seedCourses = async () => {
  try {
    // Find a teacher user (replace with an actual teacher ID if needed)
    const teacher = await User.findOne({ role: "teacher" });

    if (!teacher) {
      console.error("No teacher found. Please create a teacher user first.");
      process.exit(1);
    }

    // Sample courses
    const courses = [
      {
        courseName: "Mathematics 101",
        description: "Introduction to basic mathematics.",
        teacher: teacher._id,
      },
      {
        courseName: "Physics 101",
        description: "Introduction to physics concepts.",
        teacher: teacher._id,
      },
      {
        courseName: "Chemistry 101",
        description: "Introduction to chemistry principles.",
        teacher: teacher._id,
      },
    ];

    // Insert courses into the database
    await Course.insertMany(courses);
    console.log("Courses seeded successfully!");
    process.exit(0); // Exit the script after successful seeding
  } catch (error) {
    console.error("Error seeding courses:", error);
    process.exit(1); // Exit the script with an error code
  }
};

// Run the seeding function
seedCourses();