import {db} from "../config/firebase.js"

class UserService {
  constructor() {
    this.userCollection = db.collection("users")
  }

  async userExist(uid) {
    const doc = await this.userCollection.doc(uid).get()
    return doc.exists
  }

  async createUser({uid, email, role = "employee"}) {
    await this.userCollection.doc(uid).set({uid, email, role})
    return {uid, email, role}
  }

  async fetchUserData(uid) {
    const doc = await this.userCollection.doc(uid).get()
    if (!doc.exists) return null
    return doc.data()
  }
}

export default new UserService()