import UserService from "../services/UserService.js";

const userService = new UserService();

export const adminMiddleware = async (req, res, next) => {
  try {
    const uid = req.user.uid
    const user = await userService.fetchUserByID(uid)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin only" })
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}