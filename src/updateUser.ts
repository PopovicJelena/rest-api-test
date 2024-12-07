import { getSQL } from "./sql/sql"

type UpdateUserRequest = {
    decodedToken: {
      id: string
      role: "basic" | "admin"
    }
    userId?: string // Samo admin može proslediti `userId` da bi ažurirao druge korisnike
    firstName?: string
    lastName?: string
    username?: string
    email?: string
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
    const sql = getSQL();

    if (decodedToken.role === "basic" && userId && userId !== decodedToken.id) {
        throw new Error("You can only update your own data")
    }

    const targetUserId = decodedToken.role === "admin" ? userId || decodedToken.id : decodedToken.id

    if (username || email) {
        const duplicateCheck = (await sql.query(
            "SELECT * FROM user WHERE (username = ? OR email = ?) AND id != ?",
            [username, email, targetUserId]
        ))[0] as any[]

        if (duplicateCheck.length > 0) {
            return{message:"Username or email already exists"}
        }
    }

    // Ažuriranje korisničkih podataka
    await sql.query(`
        UPDATE users SET 
        first_name = COALESCE(?, first_name), 
        last_name = COALESCE(?, last_name), 
        username = COALESCE(?, username), 
        email = COALESCE(?, email) 
        WHERE id = ?`,
        [firstName, lastName, username, email, targetUserId]
    )

    return { message: "User updated successfully" }
}
