import { db, admin } from "../config/firebase.js"

export default class User {
  constructor({ uid, email, role = "employee", createdAt }) {
    this.uid = uid
    this.email = email
    this.role = role
    this.createdAt = createdAt
  }

  static collection() {
    return db.collection("users")
  }

  // get 1 user data
  static async getById(uid) {
    const doc = await User.collection().doc(uid).get()
    if (!doc.exists) return null
    const data = doc.data()
    return new User(data)
  }

  // create a delete for user

  // create a update for user

  // create 1 user data
  // save user (fails if exists)
  async saveIfNotExists() {
    const docRef = User.collection().doc(this.uid);
    try {
      await docRef.create({
        uid: this.uid,
        email: this.email,
        role: this.role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return this;
    } catch (err) {
      if (err.code === 6 || err.message.includes("already exists")) {
        throw new Error("User already exists");
      }
      throw err;
    }
  }

  // get all users from the collection
  static async getAll(limit, lastDoc) {
    let query = User.collection().orderBy("createdAt")

    if (limit) query = query.limit(limit)
    if (lastDoc) query = query.startAfter(lastDoc)


    const snapshot = await query.get()

    const users = []
    snapshot.forEach(doc => {
      users.push(new User({ uid: doc.id, ...doc.data() }))
    })

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null

    return { users, lastVisible }

  }

  //
  static async fetchCountUsers() {
    const snapshot = await User.collection().count().get();
    return snapshot.data().count;
  }

}
