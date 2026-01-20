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
// this route to create a new task
router.post("/task", authMiddleware, adminMiddleware, taskController.createTask)

// this route to get all tasks
router.get("/tasks", authMiddleware, adminMiddleware, taskController.getAllTasks)

export default router;