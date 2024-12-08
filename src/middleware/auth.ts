import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export type DecodedToken = {
    userId: string
    first_name: string
    last_name: string
    username: string
    email: string
    role: "basic" | "admin"
    exp: number
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        let decodedToken: DecodedToken | null = null
        const token = typeof authHeader === 'string' ? authHeader.split(' ')[1] : null

        if (token != null && token.length > 0) {
            const verified = jwt.verify(token, process.env.JWT_SECRET!) as unknown as DecodedToken

            if (verified) {
                decodedToken = verified
            }
        }

        if (!token) throw new Error("No token provided")

        req.body.decodedToken = decodedToken      
        next()
    } catch (error) {
        res.status(401).json({ error: "Please authenticate" })
    }
}
