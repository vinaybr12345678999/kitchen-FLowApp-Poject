import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        (req as any).user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

export default authenticate;
export const authorizeRoles = (...roles: string[]) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    };
};