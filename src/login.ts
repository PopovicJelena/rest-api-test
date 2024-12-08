import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { getSQL } from "./sql/sql"

export type User = {
    id: string
    first_name: string
    last_name: string
    username: string
    email: string
    password: string
    role: "basic" | "admin"
}

export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    status: 'success'
    id: string
    first_name: string
    last_name: string
    username: string
    email: string
    role: "basic" | "admin"
    token: string
} | {
    status: 'fail'
    message: string
}


export async function login({email, password}: LoginRequest): Promise<LoginResponse>{
    const sql = getSQL() 
    
    const users = (await sql.query(
        `SELECT * FROM restapitest.user WHERE email = ?`, 
        [email]
    ))[0] as User[]

    if (users.length === 0) {
        return {
            status: 'fail',
            message: "User with this email doesn't exist"
        }
    } else if (users.length > 1) {
        // Should not happen since email is unique in user table
        throw new Error(`Multiple emails ${email}`)
    } else {
        const user = users[0]

        const passwordsMatch = bcrypt.compare(password, user.password)

        if (!passwordsMatch) {
            return {
                status: 'fail',
                message: "Wrong password"
            }
        }

        const token = jwt.sign({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            email: user.email,
            role: user.role,
          }, 
          process.env.JWT_SECRET!, 
          { expiresIn: "12h" }
        )

        return {
            status: 'success',
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        }
    }
}
