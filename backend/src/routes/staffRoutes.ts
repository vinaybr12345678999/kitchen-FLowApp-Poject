import { Router } from "express";

import {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deactivateStaff,
    activateStaff,
    deleteStaff,
} from "../controllers/staffController";

const router = Router();

// Create staff
router.post("/", createStaff);

// Get all staff
router.get("/", getAllStaff);

// Get staff by ID
router.get("/:staffId", getStaffById);

// Update staff
router.patch("/:staffId", updateStaff);

// Activate staff
router.patch(
    "/:staffId/activate",
    activateStaff
);

// Deactivate staff
router.patch(
    "/:staffId/deactivate",
    deactivateStaff
);

// Delete staff
router.delete(
    "/:staffId",
    deleteStaff
);

export default router;