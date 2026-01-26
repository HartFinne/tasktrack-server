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

  static async fetchTasks({ uid = null, status = null, limit = null, lastDoc = null }) {
    let query = Task.collection();

    if (uid) {
      query = query.where("assignedTo", "==", uid);
    }

    if (status && status !== "all") {
      query = query.where("status", "==", status);
    }

    query = query.orderBy("createdAt", "asc");

    if (limit) query = query.limit(limit);
    if (lastDoc) query = query.startAfter(lastDoc);

    const snapshot = await query.get();

    const tasks = [];
    snapshot.forEach(doc => tasks.push(new Task({ uid: doc.id, ...doc.data() })));
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

  static async fetchCountTasks({ uid = null } = {}) {
    const statuses = ["backlog", "in_progress", "done"];
    const counts = {};

    // Count all tasks (no status filter)
    let baseQuery = Task.collection();
    if (uid) baseQuery = baseQuery.where("assignedTo", "==", uid);
    const allSnapshot = await baseQuery.count().get();
    counts.all = allSnapshot.data().count || 0;

    // Count per status
    for (const status of statuses) {
      let query = Task.collection();
      if (uid) query = query.where("assignedTo", "==", uid);
      query = query.where("status", "==", status);

      const snapshot = await query.count().get();
      counts[status] = snapshot.data().count || 0;
    }

    return counts;
  }

}

