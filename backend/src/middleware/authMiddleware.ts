import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export interface AuthRequest extends Request {
   
    user?: {
        id: string;
        role: "WAITER" | "KITCHEN" | "MANAGER";
    };
}


export const authMiddleware = (
    
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader) {

        
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }
    
    const [bearer, token] = authHeader.split(" ");

   
    if (bearer !== "Bearer" || !token) {

        return res.status(401).json({
            message: "Invalid authorization format."
        });
    }


    try {

       
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

     
        req.user = decoded as AuthRequest["user"];

       
        next();

    } catch (error) {

      
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};


export default authMiddleware;