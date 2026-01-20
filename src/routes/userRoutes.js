import express from "express"
import UserService from "../services/UserService.js";
import { UserController } from "../controllers/userController.js";

import { authMiddleware } from "../middleware/authMiddleware.js"
import { adminMiddleware } from "../middleware/adminMiddleware.js";


const router = express.Router()

// DI
const userService = new UserService()
const userController = UserController(userService)


// Protected route
router.post("/register", authMiddleware, userController.registerUser)
router.get("/me", authMiddleware, userController.getUserByID)

router.get("/users", authMiddleware, adminMiddleware, userController.getAllUsers)

export default router;