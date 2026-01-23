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

// this route to assign someone to a task
router.put("/tasks/:taskId/assign", authMiddleware, adminMiddleware, taskController.assignTask)

// this route to is to see the user assign task
router.get("/tasks/my", authMiddleware, taskController.getTasksAssignedToUser)

// this route to update the status of a task
router.put("/tasks/:taskId/status", authMiddleware, taskController.updateTaskStatus)

export default router;