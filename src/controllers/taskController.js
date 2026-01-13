export const TaskController = (taskService) => {
  return {
    // create task
    createTask: async (req, res) => {
      const { title, description } = req.body
      try {
        const newTask = await taskService.createTask({ title, description })
        res.status(201).json({ message: "Task successfully created", task: newTask })
      } catch (error) {
        return res.status(400).json({ message: error.message })
      }
    },

    // get all tasks
    getAllTasks: async (req, res) => {
      try {
        const tasks = await taskService.fetchAllTasks()
        return res.status(200).json(tasks)
      } catch (error) {
        console.error("Error fetching tasks", error)
        return res.status(500).json({ message: error.message })
      }
    }
  }
}