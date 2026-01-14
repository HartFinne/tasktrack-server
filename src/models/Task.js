import { db, admin } from "../config/firebase.js"

export default class Task {
  constructor({ uid, title, description, status, assignedTo, assignedEmail, createdAt }) {
    this.uid = uid
    this.title = title
    this.description = description
    this.status = status
    this.assignedTo = assignedTo
    this.assignedEmail = assignedEmail
    this.createdAt = createdAt
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

  static async getAll(limit, lastDoc) {
    let query = Task.collection().orderBy("createdAt").limit(limit)

    if (lastDoc) {
      query = query.startAfter(lastDoc)
    }

    const snapshot = await query.get()


    const tasks = []
    snapshot.forEach(doc => {
      console.log(doc.data)
      tasks.push(new Task({ uid: doc.id, ...doc.data() }))
    })

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null

    return { tasks, lastVisible }
  }

}