

export const UserController = (userService) => {
  return {
    // register user
    registerUser: async(req, res) => {
      const {uid, email} = req.user

      try {
        const exists = await userService.userExist(uid)

        if (exists) {
          return res.status(400).json({ message: "User already exists" })
        }

        const newUser = await userService.createUser({uid, email})

        return res.status(201).json({
          message: "User registered",
          user: newUser
        })

      } catch (error) {
        console.error(error)
        return res.status(500).json({message: "Server Error"})
      }
    }, 

    // get user data
    getUserData: async(req, res) => {
      try {
        const data = await userService.fetchUserData(req.user.uid)

        if (!data) {
          return res.status(404).json({message: "User not found"})
        }

        res.status(200).json(data)

      } catch (error) {
        console.error(error)
        res.status(500).json({message: "Server Error"})
      }
    }
  }
  
}


