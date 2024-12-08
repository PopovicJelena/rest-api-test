import { DecodedToken } from "../middleware/auth"
import { getSQL } from "../sql/sql"
import { v4 as uuidv4 } from "uuid"

type CreateNewTaskRequest = {
    decodedToken: DecodedToken
    body: string
}

type CreateNewTaskResponse = {
    id: string
    body: string
    created_by: string
    created_at: number // timestamp in seconds
}

export async function createNewTask({
    decodedToken, 
    body
}: CreateNewTaskRequest): Promise<CreateNewTaskResponse>{
    const sql = getSQL() 

    if (decodedToken.role === "admin") {
        throw new Error("Admins cannot create tasks")
    } 

    const id = uuidv4()

    const created_at = Math.floor(Date.now() / 1000)

    await sql.query(
        "INSERT INTO task (id, body, created_by, created_at) VALUES (?, ?, ?, ?)",
        [id, body, decodedToken.userId, created_at]
    )
    
    return {
        id,
        body,
        created_by: decodedToken.userId,
        created_at,
    }

}
