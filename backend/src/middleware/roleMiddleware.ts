import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

type UserRole = "MANAGER" | "WAITER" | "KITCHEN";

// ========================================
// ROLE MIDDLEWARE
// ========================================

const roleMiddleware = (
    allowedRoles: UserRole[]
) => {
    return (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): void => {
        // Check authentication
        if (!req.user) {
            res.status(401).json({
                message: "Authentication required",
            });
            return;
        }

        // Check role
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                message: "Access denied",
            });
            return;
        }

        next();
    };
};

export default roleMiddleware;