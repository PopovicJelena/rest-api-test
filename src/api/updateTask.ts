import { getSQL } from "../sql/sql"

export type Task = {
    id: string
    body: string
    created_by: string
    created_at: number
}

type UpdateTaskRequest = {
    decodedToken: {
        id: string
        role: "basic" | "admin"
    }
    taskId: string
    body: string
}

type UpdateTaskResponse = {
    message: string
}

export async function updateTask({
    decodedToken,
    taskId,
    body,
}: UpdateTaskRequest): Promise<UpdateTaskResponse> {
    const sql = getSQL()

    // if user has role "basic", check if the task is his
    if (decodedToken.role === "basic") {
        const task = (await sql.query(
        "SELECT * FROM task WHERE id = ? AND created_by = ?",
        [taskId, decodedToken.id]
        ))[0] as Task[]

        if (task.length === 0) {
            return {message: "You can only update your own tasks"}
        }
    }
    
    await sql.query("UPDATE task SET body = ? WHERE id = ?", [
        body,
        taskId,
    ])

    return {
        message: "Task updated successfully",
    }
}
