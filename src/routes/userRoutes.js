import express from "express"
import { getUserData, registerUser } from "../controllers/userController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"  

const router = express.Router()

// Protected route
router.post("/register", authMiddleware, registerUser)
router.get("/me", authMiddleware, getUserData)

export default router;