import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

// ========================================
// CREATE STAFF
// POST /api/users/staff
// Only MANAGER can access this route
// ========================================

export const createStaff = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            name,
            email,
            password,
            role,
        } = req.body;

        // ========================================
        // VALIDATION
        // ========================================

        if (
            !name ||
            !email ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                message:
                    "Name, email, password and role are required",
            });
        }

        // ========================================
        // ONLY WAITER / KITCHEN STAFF
        // ========================================

        if (
            role !== "WAITER" &&
            role !== "KITCHEN_STAFF"
        ) {
            return res.status(400).json({
                message:
                    "Only WAITER or KITCHEN_STAFF can be created",
            });
        }

        // ========================================
        // PASSWORD VALIDATION
        // ========================================

        if (password.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters",
            });
        }

        // ========================================
        // CHECK EMAIL
        // ========================================

        const normalizedEmail =
            email.trim().toLowerCase();

        const existingUser =
            await User.findOne({
                email: normalizedEmail,
            });

        if (existingUser) {
            return res.status(400).json({
                message:
                    "User with this email already exists",
            });
        }

        // ========================================
        // HASH PASSWORD
        // ========================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        // ========================================
        // CREATE STAFF
        // ========================================

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role,
            isActive: true,
        });

        // ========================================
        // RESPONSE
        // ========================================

        return res.status(201).json({
            message:
                `${role === "WAITER"
                    ? "Waiter"
                    : "Kitchen Staff"
                } created successfully`,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        console.error(
            "Create staff error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};