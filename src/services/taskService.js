import Task from "../models/Task.js"

export default class UserService {

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

  async fetchAllTasks(limit = 5, page = 1) {
    return await Task.getAll(limit, page)
  }

}