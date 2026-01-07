import express from "express"
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.get("/users", (req, res) => {
  const users = [
    { id: 1, name: "jimmuel"}
  ]
  res.json(users)
})

app.use("/users", userRoutes)



export default app