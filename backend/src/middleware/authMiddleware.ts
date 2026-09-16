import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ========================================
// AUTH TYPES
// ========================================

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: "MANAGER" | "WAITER" | "KITCHEN";
    };
}

// ========================================
// JWT PAYLOAD TYPE
// ========================================

interface JwtPayload {
    userId: string;
    role: "MANAGER" | "WAITER" | "KITCHEN";
}

// ========================================
// AUTHENTICATE
// ========================================

const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Get Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                message: "Authorization token required",
            });
            return;
        }

        // Expected:
        // Authorization: Bearer TOKEN

        const parts = authHeader.split(" ");

        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {
            res.status(401).json({
                message: "Invalid authorization format",
            });
            return;
        }

        const token = parts[1];

        // JWT secret
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            res.status(500).json({
                message: "JWT_SECRET is missing in .env",
            });
            return;
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            secret
        ) as JwtPayload;

        // Check decoded data
        if (!decoded.userId || !decoded.role) {
            res.status(401).json({
                message: "Invalid token",
            });
            return;
        }

        // Attach user to request
        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };

        next();

    } catch (error) {
        console.error(
            "Authentication error:",
            error
        );

        res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

export default authenticate;