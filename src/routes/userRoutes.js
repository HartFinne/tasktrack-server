import express from "express"
import { registerUser } from "../controllers/userController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"  

const router = express.Router()

// Protected route
router.post("/register", authMiddleware, registerUser)

export default router;