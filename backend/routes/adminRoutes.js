// backend/routes/adminRoutes.js
const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.get("/users", adminController.getUsers);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;