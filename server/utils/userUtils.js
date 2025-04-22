export const getUsersForSidebar = async (req, res) => {
  try {
    const currentUser = req.user;
    
    if (!currentUser) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Get all users except the current user
    const users = await User.find({ _id: { $ne: currentUser._id } })
      .select("-password")
      .lean();

    // Filter users based on role and relationships
    const filteredUsers = users.filter(user => {
      // Admin can see everyone
      if (currentUser.role === "admin") {
        return true;
      }

      // Teacher visibility
      if (currentUser.role === "teacher") {
        // Teachers can see:
        // 1. All students
        // 2. All parents
        // 3. Other teachers
        return ["student", "parent", "teacher"].includes(user.role);
      }

      // Parent visibility
      if (currentUser.role === "parent") {
        // Parents can see:
        // 1. All teachers
        // 2. Their child's teachers
        // 3. Other parents (if they have children in the same class)
        if (user.role === "teacher") return true;
        if (user.role === "parent") {
          // If both parents have children in the same class
          return currentUser.children?.some(childId => 
            user.children?.includes(childId)
          );
        }
        return false;
      }

      // Student visibility
      if (currentUser.role === "student") {
        // Students can see:
        // 1. All teachers
        // 2. Other students in their classes
        // 3. Their parents
        if (user.role === "teacher") return true;
        if (user.role === "parent") {
          // Show their own parents
          return user.children?.includes(currentUser._id);
        }
        if (user.role === "student") {
          // Show students in the same classes
          return currentUser.classes?.some(classId => 
            user.classes?.includes(classId)
          );
        }
        return false;
      }

      return false;
    });

    res.json(filteredUsers);
  } catch (error) {
    console.error("Error getting users for sidebar:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
}; 