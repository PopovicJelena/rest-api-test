import { getSQL } from "./sql/sql"
import { Task } from "./updateTask"

type DeleteTaskRequest = {
    decodedToken: {
        role: "basic" | "admin"
    }
    taskId: string
}

type DeleteTaskResponse = {
    message: string;
}

export async function deleteTask({
    decodedToken,
    taskId,
}: DeleteTaskRequest): Promise<DeleteTaskResponse> {
    const sql = getSQL()

    console.log('decod', decodedToken.role)

    if (decodedToken.role !== "admin") {
        throw new Error("Only admin can delete tasks")
    }

    const task = (await sql.query(
        "SELECT * FROM task WHERE id = ?",
        [taskId]
    ))[0] as Task[];

    if (task.length === 0) {
        return {message: "Task not found"}
    }

    await sql.query("DELETE FROM tasks WHERE id = ?", [taskId])

    return {
        message: "Task deleted successfully",
    }
}