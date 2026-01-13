import { db } from "../config/firebase.js"

export default class Task {
  constructor({ title, description, status, assignedTo, assignedEmail }) {
    this.title = title
    this.description = description
    this.status = status
    this.assignedTo = assignedTo
    this.assignedEmail = assignedEmail
  }

  static collection() {
    return db.collection("tasks")
  }



  // save this to the task collection
  async save() {
    await Task.collection().doc().set({
      title: this.title,
      description: this.description,
      status: this.status,
      assignedTo: this.assignedTo,
      assignedEmail: this.assignedEmail
    })
    return this
  }

  static async getAll() {
    const snapshot = await Task.collection().get()

    const tasks = []
    snapshot.forEach(doc => {
      tasks.push(new Task(doc.data()))
    })

    return tasks
  }

}