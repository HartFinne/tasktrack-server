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

  static async getAll(limit, page) {
    const snapshot = await Task.collection()
      .orderBy("title")       // optional: order tasks consistently
      .offset((page - 1) * limit)  // Firestore offset
      .limit(limit)
      .get();

    const tasks = [];
    snapshot.forEach(doc => {
      tasks.push(new Task({
        uid: doc.id,
        ...doc.data()
      }));
    });

    return tasks;
  }

}