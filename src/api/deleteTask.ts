import { getSQL } from "../sql/sql"

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

    if (decodedToken.role !== "admin") {
        throw new Error("Only admin can delete tasks")
    }

    await sql.query("DELETE FROM task WHERE id = ?", [taskId])

    return {
        message: "Task deleted successfully",
    }
}