import Task from "../models/Task.js"

export default class TaskService {

  // Business logic 
  async createTask({ title, description }) {
    // Validation
    if (!title || !description) {
      throw new Error("Title and Description are required")
    }

    // check if string or not
    if (typeof title !== "string" || typeof description !== "string") {
      throw new Error("Title and Description must be strings");
    }

    // check if the length is greater than 100 and 1000
    if (title.length > 100) throw new Error("Title too long");
    if (description.length > 1000) throw new Error("Description too long");

    // create new task
    const task = new Task({
      title,
      description,
      status: "backlog",
      assignedTo: null,
      assignedEmail: null
    })

    return await task.save()
  }

  async fetchAllTasks(limit, lastDoc) {
    return await Task.getAll(limit, lastDoc)
  }

  // for pagination returns a snapshot
  async fetchTaskDocByUid(uid) {
    const docRef = Task.collection().doc(uid)
    const snapshot = await docRef.get()
    console.log(snapshot)
    return snapshot.exists ? snapshot : null
  }

  // for assigning task
  async assignTask({ taskId, userId, userEmail }) {
    // validation
    if (!taskId || !userId || !userEmail) {
      throw new Error("taskId, userId, and userEmail are required")
    }

    const task = await Task.findById(taskId)
    if (!task) {
      throw new Error("Task not found")
    }

    await Task.update(taskId, {
      assignedTo: userId,
      assignedEmail: userEmail
    });

    return {
      taskId,
      assignedTo: userId,
      assignedEmail: userEmail
    };
  }

  //
  async fetchTasksAssignedToUser(uid, limit, lastDoc) {
    if (!uid) {
      throw new Error("User not authenticated")
    }

    return Task.findTasksByAssignedUser(uid, limit, lastDoc)
  }


  async updateTaskStatus({ taskId, status, uid }) {

    if (!taskId || !status) {
      throw new Error("taskId and status are required")
    }

    const allowedStatuses = ["backlog", "in_progress", "done"]
    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid task status")
    }

    const task = await Task.findById(taskId)
    if (!task) {
      throw new Error("Task not found")
    }

    if (task.assignedTo !== uid) {
      throw new Error("You can only update your own task")
    }


    await Task.update(taskId, { status })

    return {
      taskId,
      status
    }
  }


}