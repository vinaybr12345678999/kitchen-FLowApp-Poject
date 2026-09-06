import express from "express";

import {
    createMenuItem,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem,
} from "../controllers/menuController";

import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = express.Router();

// ========================================
// Get menu items
// Waiter + Kitchen + Manager can view
// ========================================

router.get(
    "/",
    authMiddleware,
    getMenuItems
);

// ========================================
// Create menu item
// MANAGER ONLY
// ========================================

router.post(
    "/",
    authMiddleware,
    roleMiddleware(["MANAGER"]),
    createMenuItem
);

// ========================================
// Update menu item
// MANAGER ONLY
// ========================================

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware(["MANAGER"]),
    updateMenuItem
);

// ========================================
// Delete menu item
// MANAGER ONLY
// ========================================

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["MANAGER"]),
    deleteMenuItem
);

export default router;