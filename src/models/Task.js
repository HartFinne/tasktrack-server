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
      assignedEmail: this.assignedEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })
    return this
  }

  static async getAll(limit, lastDoc) {

    let query = Task.collection().orderBy("createdAt");

    if (limit) query = query.limit(limit);

    if (lastDoc) query = query.startAfter(lastDoc);

    const snapshot = await query.get();

    const tasks = [];
    snapshot.forEach(doc => {
      tasks.push(new Task({ uid: doc.id, ...doc.data() })); // 
    });

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { tasks, lastVisible };
  }


  static async findById(taskId) {
    const doc = await Task.collection().doc(taskId).get();
    return doc.exists ? doc : null;
  }

  static async update(taskId, data) {
    return Task.collection().doc(taskId).update(data);
  }


  static async findTasksByAssignedUser(uid, limit, lastDoc) {

    let query = Task.collection()
      .where("assignedTo", "==", uid)
      .orderBy("createdAt", "asc")
      .limit(limit)

    if (lastDoc) {
      query = query.startAfter(lastDoc)
    }

    const snapshot = await query.get()

    const tasks = []
    snapshot.forEach(doc => {
      tasks.push(new Task({ uid: doc.id, ...doc.data() }))
    })

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null

    return { tasks, lastVisible }
  }
}

