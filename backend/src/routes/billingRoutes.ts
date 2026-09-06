
import { Router } from "express";

import {
    generateBill,
    getBillByOrder,
} from "../controllers/billController";

const router = Router();

// ========================================
// GENERATE BILL
// POST /api/billing/:orderId
// ========================================

router.post(
    "/:orderId",
    generateBill
);

// ========================================
// GET BILL BY ORDER
// GET /api/billing/:orderId
// ========================================

router.get(
    "/:orderId",
    getBillByOrder
);

export default router
