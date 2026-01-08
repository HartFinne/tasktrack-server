import userService from "../services/userService.js"


// register user
export const registerUser = async (req, res) => {
  const {uid, email} = req.user

  try {
    const exists = await userService.userExist(uid)

    if (exists) {
      return res.status(400).json({message: "User already exists"})
    }

    const newUser = await userService.createUser({uid, email})

    return res.status(201).json({message: "User registered", user: newUser})

  } catch (err) {
    console.error(err)
    return res.status(500).json({message: "Server Error"})
  }
}


// fetch user data
export const getUserData = async(req, res) => {
  try {
    const userData = await userService.fetchUserData(req.user.uid)
    if (!userData) return res.status(404).json({message: "User not found"})

    res.json(userData)
  } catch(err){
    console.error(err)
    res.status(500).json({message: "Server error"})
  }
}

