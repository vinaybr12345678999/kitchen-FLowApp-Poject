import express from "express";

import {
    createStaff,
} from "../controllers/userController";

import authenticate from "../middleware/authMiddleware";

import roleMiddleware from "../middleware/roleMiddleware";

const router = express.Router();

// ========================================
// CREATE STAFF
// POST /api/users/staff
// ========================================

router.post(
    "/staff",
    authenticate,
    roleMiddleware(["MANAGER"]),
    createStaff
);

export default router;