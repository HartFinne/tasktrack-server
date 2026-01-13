import { db } from "../config/firebase.js"

export default class User {
  constructor({ uid, email, role = "employee" }) {
    this.uid = uid
    this.email = email
    this.role = role
  }

  static collection() {
    return db.collection("users")
  }

  static async getById(uid) {
    const doc = await User.collection().doc(uid).get()
    if (!doc.exists) return null
    const data = doc.data()
    return new User(data)
  }

  async save() {
    await User.collection().doc(this.uid).set({
      uid: this.uid,
      email: this.email,
      role: this.role
    })
    return this
  }

}
