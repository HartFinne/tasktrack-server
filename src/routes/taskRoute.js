import express from "express"

import TaskService from "../services/taskService.js"
import { TaskController } from "../controllers/taskController.js"

import { authMiddleware } from "../middleware/authMiddleware.js"
import { adminMiddleware } from "../middleware/adminMiddleware.js"

const router = express.Router()

// DI
const taskService = new TaskService()
const taskController = TaskController(taskService)

// Protected route
router.post("/task", authMiddleware, adminMiddleware, taskController.createTask)

export default router;