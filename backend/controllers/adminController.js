// backend/controllers/adminController.js
import User from '../models/User.js';

const getUsers = async (req, res) => { // const or let
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

const deleteUser = async (req, res) => { // const or let
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};

export { getUsers, deleteUser }; // Named exports
// or
// export default { getUsers, deleteUser }; // Default export