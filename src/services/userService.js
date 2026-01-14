import User from "../models/User.js"

export default class UserService {

  // Check if user exist only returning boolean
  async userExist(uid) {
    const existingUser = await User.getById(uid)
    return !!existingUser
  }

  // register a use in firebase
  async createUser({ uid, email, role = "employee" }) {
    // Validation
    if (!uid || !email) {
      throw new Error("UID and email are required")
    }

    // Sanitization
    const sanitizedEmail = email.trim().toLowerCase()

    // Check if user already exists
    const exists = await this.userExist(uid)
    if (exists) {
      throw new Error("User already exists")
    }

    // Create user model
    const user = new User({
      uid,
      email: sanitizedEmail,
      role
    })

    // Saving to firestore
    return await user.save()
  }

  // fetch user data by id
  async fetchUserByID(uid) {
    return await User.getById(uid)
  }


  // fetch all users
  async fetchAllUsers(limit = 10) {
    return await User.getAll(limit)
  }
}
