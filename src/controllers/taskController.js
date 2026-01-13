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
    }


    // get users
  }
}