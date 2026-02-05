import User from "../models/User.js"

export default class UserService {

  // register a use in firebase
  async createUser({ uid, email, role = "employee" }) {
    if (!uid || !email) throw new Error("UID and email are required");

    const sanitizedEmail = email.trim().toLowerCase();

    const user = new User({ uid, email: sanitizedEmail, role });

    // persist user using model's responsibility
    return await user.saveIfNotExists();
  }

  // fetch user data by id
  async fetchUserByID(uid) {
    return await User.getById(uid)
  }


  // fetch all users
  async fetchAllUsers({ limit, lastDoc, role }) {
    return await User.getAll({ limit, lastDoc, role })
  }

  // for pagination returns a snapshot
  async fetchUserDocByUid(uid) {
    const docRef = User.collection().doc(uid)
    const snapshot = await docRef.get()
    console.log(snapshot)
    return snapshot.exists ? snapshot : null
  }

  async fetchAllCountUsers() {
    return await User.fetchCountUsers()
  }
}
