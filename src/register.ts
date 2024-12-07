import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { getSQL } from "./sql/sql"
import { User } from "./login";

type RegisterRequest = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

type RegisterResponse = {
  message: string
}

export async function register({
  firstName,
  lastName,
  username,
  email,
  password,
}: RegisterRequest): Promise<RegisterResponse> {
  const sql = getSQL()

  const existingUser = (await sql.query(
    "SELECT * FROM restapitest.user WHERE username = ? OR email = ?",
    [username, email]
  ))[0] as User[]

  if (existingUser.length > 0) {
    return {message: "Username or email already in use"}
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const id = uuidv4()

  await sql.query(
    `INSERT INTO restapitest.user 
    (id, first_name, last_name, username, email, password, role) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, firstName, lastName, username, email, hashedPassword, "basic"]
  )

  return {
    message: "User registered successfully",
  }
}
