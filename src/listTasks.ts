import { getSQL } from "./sql/sql";
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
    total: number
    page: number
    pageSize: number 
}

export async function listTasks({
    decodedToken,
    page = 1,
    pageSize = 10,
    sort = "desc",
}: ListTasksRequest): Promise<ListTasksResponse> {
    const sql = getSQL()
    const offset = (page - 1) * pageSize // Prva stavka na trenutnoj stranici

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

    const countQuery = `
        SELECT COUNT(*) AS total FROM task
        ${decodedToken.role === "basic" ? "WHERE created_by = ?" : ""}
    `

    const countParams = decodedToken.role === "basic" ? [decodedToken.id] : [];
    const totalResult = (await sql.query(countQuery, countParams))[0] as {
        total: number
    }[]

    const total = totalResult[0].total

    return {
        tasks,
        total,
        page,
        pageSize,
    }
}
