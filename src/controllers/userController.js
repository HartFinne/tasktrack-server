export const UserController = (userService) => {
  return {
    // register user
    registerUser: async (req, res) => {
      const { uid, email } = req.user

      try {
        const newUser = await userService.createUser({ uid, email })
        res.status(201).json({ message: "User successfully registered", user: newUser })
      } catch (error) {
        return res.status(400).json({ message: error.message })
      }
    },

    // get user data by id
    getUserByID: async (req, res) => {
      try {
        const data = await userService.fetchUserByID(req.user.uid)

        if (!data) return res.status(404).json({ message: "User not found" })

        res.status(200).json(data)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
      }
    },

    // 
    getAllUsers: async (req, res) => {
      try {
        const users = await userService.fetchAllUsers()
        return res.status(200).json(users)
      } catch (error) {
        console.error("Error fetching users: ", error)
        return res.status(500).json({ message: error.message })
      }
    }
  }

}


