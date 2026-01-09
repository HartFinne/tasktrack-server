import UserRepository from "../repositories/UserRepository.js";
import User from "../models/User.js"

export default class UserService {
  constructor(userServiceRepository = new UserRepository()) {
    this.userServiceRepository = userServiceRepository
  }

  // search if user exists in firestorage
  async userExist(uid) {
    const user = await this.userServiceRepository.getById(uid);
    return !!user;
  }

  // create a use in firestorage
  async createUser({uid, email, role = "employee"}) {
    const user = new User({ uid, email, role });
    console.log(user)
    return await this.userServiceRepository.create(user);
  }

  // get user data in firestorage
  async fetchUserData(uid) {
    return await this.userServiceRepository.getById(uid)
  }
}
