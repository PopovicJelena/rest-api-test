import { getSQL } from "../sql/sql";
import { Task } from "./updateTask";

type ListTasksRequest = {
    decodedToken: {
        id: string
        role: "basic" | "admin"
    }
    page: number
    pageSize: number
    sort: "asc" | "desc"
}

type ListTasksResponse = {
    tasks: Task[]
    page: number
    pageSize: number 
}

export async function listTasks({
    decodedToken,
    page,
    pageSize,
    sort,
}: ListTasksRequest): Promise<ListTasksResponse> {
    const sql = getSQL()
    const offset = (page - 1) * pageSize

    let tasksQuery = `
        SELECT * FROM task
        ${decodedToken.role === "basic" ? "WHERE created_by = ?" : ""}
        ORDER BY created_at ${sort}
        LIMIT ? OFFSET ?
    `

    const queryParams = decodedToken.role === "basic"
        ? [decodedToken.id, pageSize, offset]
        : [pageSize, offset]
    
    const tasks = (await sql.query(tasksQuery, queryParams))[0] as Task[]

    return {
        tasks,
        page,
        pageSize,
    }
}
