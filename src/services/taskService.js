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

  // admin function
  async fetchAllCountTasks() {
    return await Task.fetchCountTasks({})
  }

  async fetchAllTasks(limit, lastDoc, status) {
    return await Task.fetchTasks({ limit, lastDoc, status })
  }

  // for pagination returns a snapshot
  async fetchTaskDocByUid(uid) {
    const task = await Task.findById(uid)
    // const docRef = Task.collection().doc(uid)
    // const snapshot = await docRef.get()
    console.log(task)
    return task.exists ? task : null
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
  async fetchTasksAssignedToUser(uid, limit, lastDoc, status) {
    if (!uid) {
      throw new Error("User not authenticated")
    }

    return Task.fetchTasks({ uid, limit, lastDoc, status })
  }


  async updateTaskStatus({ taskId, status, uid }) {

    if (!taskId || !status) {
      throw new Error("taskId and status are required")
    }

    const allowedStatuses = ["backlog", "in_progress", "done"]
    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid task status")
    }

    const taskSnapshot = await Task.findById(taskId);
    if (!taskSnapshot) {
      throw new Error("Task not found");
    }

    const taskData = taskSnapshot.data();

    if (taskData.assignedTo !== uid) {
      throw new Error("You can only update your own task");
    }

    await Task.update(taskId, { status })

    return {
      taskId,
      status
    }
  }


}