import express from "express";

import { login } from "../controllers/authController";

import authenticate from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = express.Router();

// ========================================
// LOGIN
// POST /api/auth/login
// ========================================

router.post("/login", login);

// ========================================
// MANAGER TEST
// GET /api/auth/manager-test
// ========================================

router.get(
    "/manager-test",
    authenticate,
    roleMiddleware(["MANAGER"]),
    async (req, res) => {
        res.status(200).json({
            message: "Manager access granted",
        });
    }
);

export default router;