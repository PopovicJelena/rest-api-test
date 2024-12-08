import { User } from "../login"
import { getSQL } from "../sql/sql"

type UpdateUserRequest = {
    decodedToken: {
      id: string
      role: "basic" | "admin"
    }
    userId: string
    firstName: string
    lastName: string
    username: string
    email: string
}
  
type UpdateUserResponse = {
    message: string
}

export async function updateUser({
    decodedToken,
    userId,
    firstName,
    lastName,
    username,
    email,
}: UpdateUserRequest): Promise<UpdateUserResponse> {
    const sql = getSQL()

    if (decodedToken.role === "basic" && userId !== decodedToken.id) {
        throw new Error("You can only update your own data")
    }

    const duplicateCheck = (await sql.query(
        "SELECT * FROM user WHERE (username = ? OR email = ?) and id <> ?",
        [username, email, userId]
    ))[0] as User[]

    if (duplicateCheck.length > 0) {
        return{message:"Username or email already in use"}
    }

    await sql.query(`
        UPDATE user SET 
        first_name = ?, 
        last_name = ?, 
        username = ?, 
        email = ? 
        WHERE id = ?`,
        [firstName, lastName, username, email, userId]
    )

    return { message: "User updated successfully" }
}
