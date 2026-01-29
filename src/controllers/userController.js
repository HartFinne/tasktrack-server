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
        const limit = parseInt(req.query.limit) || null;
        const lastUid = req.query.lastUid || null;
        const role = req.query.role || null

        let lastDoc = null

        if (lastUid) {
          lastDoc = await userService.fetchUserDocByUid(lastUid)
        }

        const { users, lastVisible, hasNext } = await userService.fetchAllUsers({ limit, lastDoc, role })


        return res.status(200).json({
          users,
          lastUid: lastVisible ? lastVisible.id : null,
          hasNext
        })
      } catch (error) {
        console.error("Error fetching users: ", error)
        return res.status(500).json({ message: error.message })
      }
    },

    getAllCountTasks: async (req, res) => {
      try {
        const totalUsers = await userService.fetchAllCountUsers()
        return res.status(200).json({ totalUsers })
      } catch (error) {
        console.error("Error fetching users", error)
        return res.status(500).json({ message: error.message })
      }
    }
  }

}


