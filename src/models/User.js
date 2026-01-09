export default class User {
  constructor({ uid, email, role = "employee" }) {
    this.uid = uid
    this.email = email
    this.role = role
  }

  validate() {
    if (!this.uid || !this.email) {
      throw new Error("UID and Email are required")
    }
  }

  toFirestore() {
    return { uid: this.uid, email: this.email, role: this.role }
  }

  static fromFirestore(doc) {
    if (!doc.exists) return null
    const data = doc.data()
    return new User({ uid: data.uid, email: data.email, role: data.role })
  }

}
