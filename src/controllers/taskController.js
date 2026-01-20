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
        const limit = parseInt(req.query.limit) || 5;
        const lastUid = req.query.lastUid || null;

        let lastDoc = null
        if (lastUid) {
          lastDoc = await taskService.fetchTaskDocByUid(lastUid)
        }

        const { tasks, lastVisible } = await taskService.fetchAllTasks(limit, lastDoc)

        return res.status(200).json({
          tasks,
          lastUid: lastVisible ? lastVisible.id : null
        })
      } catch (error) {
        console.error("Error fetching tasks", error)
        return res.status(500).json({ message: error.message })
      }
    },

    // assign someone to a task
    assignTask: async (req, res) => {
      const { taskId } = req.params
      const { userId, userEmail } = req.body

      try {
        const updatedTask = await taskService.assignTask({
          taskId,
          userId,
          userEmail
        })

        return res.status(200).json({
          message: "Task successfully assigned",
          task: updatedTask
        })
      } catch (error) {
        return res.status(400).json({ message: error.message })
      }
    },

    // get the user tasks
    getTasksAssignedToUser: async (req, res) => {
      try {
        const { uid } = req.user

        console.log(uid)

        const tasks = await taskService.getTasksAssignedToUser(uid)

        return res.status(200).json({ tasks })
      } catch (error) {
        return res.status(500).json({ message: error.message })
      }
    }
  }
}