import express from "express"
import cors from "cors"
import { authMiddleware } from "./middleware/auth"
import { login } from "./login"
import { createNewTask } from "./api/createNewTask"
import { updateTask } from "./api/updateTask"
import { register } from "./register"
import { deleteTask } from "./api/deleteTask"
import { listTasks } from "./api/listTasks"
import { updateUser } from "./api/updateUser"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/login", async (req, res) => {
    try {
        const response = await login(req.body)
        res.status(200).json(response)
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
})

app.post("/register", async (req, res) => {
    try {
      const response = await register(req.body)
      res.status(201).json(response)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  })

app.post("/createTask", authMiddleware, async (req, res) => {
    try {
        const task =  await createNewTask({
            decodedToken: req.body.decodedToken,
            body: req.body.body,
        })     
        res.status(201).json(task)       
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
})

app.post("/updateTask", authMiddleware, async (req, res) => {
    try {
        const result = await updateTask({
            decodedToken: req.body.decodedToken,
            taskId: req.body.id,
            body: req.body.body,
        })
        res.status(200).json(result)   
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
})

app.post("/deleteTask", authMiddleware, async (req, res) => {
    try {
        const result = await deleteTask({
            decodedToken: req.body.decodedToken,
            taskId: req.body.taskId,
        })

        res.status(200).json(result)
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
})

app.get("/tasks", authMiddleware, async (req, res) => {
    try {
        const { page, pageSize, sort } = req.query as unknown as {
            page: number
            pageSize: number
            sort: 'desc' | 'asc'
        }

        const result = await listTasks({
            decodedToken: req.body.decodedToken,
            page: +page,
            pageSize: +pageSize,
            sort,
        })
    
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
})

app.post("/updateUser", authMiddleware, async (req, res) => {
    try {
      const result = await updateUser({
        decodedToken: req.body.decodedToken,
        userId: req.body.userId, // Prosleđuje samo admin
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
      })
  
      res.status(200).json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
