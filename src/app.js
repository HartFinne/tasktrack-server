import express from "express"
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import taskRoute from "./routes/taskRoute.js"

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.get("/users", (req, res) => {
  const users = [
    { id: 1, name: "jimmuel" }
  ]
  res.json(users)
})

app.use("/users", userRoutes)
app.use("/admin", taskRoute)



export default app