import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";
import Staff from "../models/staff";

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    console.log("🔥 LOGIN API HIT", req.body);

    try {
        const { email, password } = req.body;

        // ========================================
        // CHECK INPUT
        // ========================================

        if (!email || !password) {
            res.status(400).json({
                message:
                    "Email and password are required",
            });
            return;
        }

        // ========================================
        // NORMALIZE EMAIL
        // ========================================

        const normalizedEmail = String(email)
            .trim()
            .toLowerCase();

        // ========================================
        // FIRST: CHECK MANAGER
        // ========================================

       const manager = await User.findOne({
    email: normalizedEmail,
    role: "MANAGER",
});

        if (manager) {
            // Check active
            if (!manager.isActive) {
                res.status(403).json({
                    message:
                        "Account is inactive",
                });
                return;
            }

            // Check password
            const isPasswordCorrect =
                await bcrypt.compare(
                    String(password),
                    manager.password
                );

            if (!isPasswordCorrect) {
                res.status(401).json({
                    message:
                        "Invalid email or password",
                });
                return;
            }

            // JWT secret
            const secret =
                process.env.JWT_SECRET;

            if (!secret) {
                res.status(500).json({
                    message:
                        "JWT_SECRET is missing in .env",
                });
                return;
            }

            // Create manager token
            const token = jwt.sign(
                {
                    userId:
                        manager._id.toString(),

                    role: "MANAGER",
                },
                secret,
                {
                    expiresIn: "7d",
                }
            );

            // Remove password
            const userData =
                manager.toObject();

            delete (
                userData as {
                    password?: string;
                }
            ).password;

            // Manager response
            res.status(200).json({
                message:
                    "Login successful",

                token,

                user: {
                    ...userData,
                    role: "MANAGER",
                },
            });

            return;
        }

        // ========================================
        // SECOND: CHECK STAFF
        // ========================================

        const staff = await Staff.findOne({
            email: normalizedEmail,
        });

        if (!staff) {
            res.status(401).json({
                message:
                    "Invalid email or password",
            });
            return;
        }

        // ========================================
        // CHECK STAFF ACTIVE
        // ========================================

        if (!staff.isActive) {
            res.status(403).json({
                message:
                    "Account is inactive",
            });
            return;
        }

        // ========================================
        // CHECK STAFF PASSWORD
        // ========================================

        const isPasswordCorrect =
            await bcrypt.compare(
                String(password),
                staff.password
            );

        if (!isPasswordCorrect) {
            res.status(401).json({
                message:
                    "Invalid email or password",
            });
            return;
        }

        // ========================================
        // JWT SECRET
        // ========================================

        const secret =
            process.env.JWT_SECRET;

        if (!secret) {
            res.status(500).json({
                message:
                    "JWT_SECRET is missing in .env",
            });
            return;
        }

        // ========================================
        // CREATE STAFF TOKEN
        // ========================================

        const token = jwt.sign(
            {
                userId:
                    staff._id.toString(),

                role: staff.role,
            },
            secret,
            {
                expiresIn: "7d",
            }
        );

        // ========================================
        // REMOVE PASSWORD
        // ========================================

        const userData =
            staff.toObject();

        delete (
            userData as {
                password?: string;
            }
        ).password;

        // ========================================
        // STAFF RESPONSE
        // ========================================

        res.status(200).json({
            message:
                "Login successful",

            token,

            user: userData,
        });
    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message:
                "Login failed",
        });
    }
};