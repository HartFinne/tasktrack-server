import express from "express"
import UserService from "../services/UserService.js";
import UserRepository from "../repositories/UserRepository.js";
import { UserController } from "../controllers/userController.js";

import {authMiddleware} from "../middleware/authMiddleware.js"


const router = express.Router()

// DI
const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = UserController(userService)


// Protected route
router.post("/register", authMiddleware, userController.registerUser)
router.get("/me", authMiddleware, userController.getUserData)

export default router;