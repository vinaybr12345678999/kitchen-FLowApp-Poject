import express from "express";

import {
    getTables,
    createTable,
    updateTableStatus,
} from "../controllers/tablecontroller";

import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = express.Router();

// Get all tables
// Waiter and Manager can view tables
router.get(
    "/",
    authMiddleware,
    roleMiddleware(["WAITER", "MANAGER"]),
    getTables
);

// Create a new table
// Only Manager
router.post(
    "/",
    authMiddleware,
    roleMiddleware(["MANAGER"]),
    createTable
);

// Update table status
// For now, only Manager
// Order/bill flow will control OCCUPIED -> AVAILABLE
router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware(["MANAGER"]),
    updateTableStatus
);

export default router;