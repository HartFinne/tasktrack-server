import { db } from "../config/firebase.js"

export default class Task {
  constructor({ uid, title, description, status, assignedTo, assignedEmail }) {
    this.uid = uid
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

  static async getAll(limit) {
    const snapshot = await Task.collection().limit(limit).get()

    const tasks = []
    snapshot.forEach(doc => {
      console.log(doc.id, "working")
      tasks.push(new Task({
        uid: doc.id,      // <-- existing document ID
        ...doc.data()
      }))
    })

    return tasks
  }

}