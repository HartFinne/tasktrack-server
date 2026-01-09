import IUserRepository from "./IUserRepository.js";
import { db } from "../config/firebase.js"
import User from "../models/User.js"

export default class UserRepository extends IUserRepository {
  constructor() {
    super();
    this.userCollection = db.collection("users")
  }

  async getById(uid) {
    const doc = await this.userCollection.doc(uid).get()
    return User.fromFirestore(doc)
  }

  async create(user) {
    user.validate()
    await this.userCollection.doc(user.uid).set(user.toFirestore())
    return user
  }
}