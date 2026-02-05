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

    // Ask for one extra record
    query = query.limit(Number(limit) + 1);

    if (lastDoc) query = query.startAfter(lastDoc);

    const snapshot = await query.get();

    const docs = snapshot.docs;
    let hasNext = false;

    // If more than limit, there is another page
    if (docs.length > limit) {
      hasNext = true;
      docs.pop(); // remove extra doc
    }

    const tasks = docs.map(doc => new Task({ uid: doc.id, ...doc.data() }));
    const lastVisible = docs.length ? docs[docs.length - 1] : null;

    return { tasks, lastVisible, hasNext };
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

