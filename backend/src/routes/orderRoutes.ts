import express from "express";

import {
    createOrder,
    getActiveOrders,
    getAllOrders,
    updateOrderStatus,
} from "../controllers/orderController";

import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// ========================================
// CREATE ORDER
// POST /api/orders
// ========================================

router.post(
    "/",
    authMiddleware,
    createOrder
);

// ========================================
// GET ACTIVE ORDERS
// Kitchen + Waiter
// GET /api/orders/active
// ========================================

router.get(
    "/active",
    authMiddleware,
    getActiveOrders
);

// ========================================
// GET ALL ORDERS
// Manager
// GET /api/orders/all
// ========================================

router.get(
    "/all",
    authMiddleware,
    getAllOrders
);

// ========================================
// UPDATE ORDER STATUS
// NEW → PREPARING
// PREPARING → READY
// READY → SERVED
// ========================================

router.patch(
    "/:orderId/status",
    authMiddleware,
    updateOrderStatus
);

export default router;