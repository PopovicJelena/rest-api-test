import mysql from "mysql2/promise"
import dotenv from "dotenv"
dotenv.config()

let pool: mysql.Pool | undefined = undefined

export function getSQL() {
    const isDocker = process.env.DOCKER_ENV === "true"

    if(pool == null) {
        pool = mysql.createPool({
            host: isDocker ? "db" : process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        })
    }
    return pool
}
