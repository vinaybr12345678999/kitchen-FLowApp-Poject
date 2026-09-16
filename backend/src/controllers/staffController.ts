import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Staff from "../models/staff";

// ========================================
// CREATE STAFF
// POST /api/staff
// ========================================

export const createStaff = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            name,
            image,
            email,
            phone,
            password,
            role,
        } = req.body || {};

        // ========================================
        // VALIDATION
        // ========================================

        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !role
        ) {
            res.status(400).json({
                message:
                    "Name, email, phone, password and role are required",
            });
            return;
        }

        // ========================================
        // VALIDATE ROLE
        // ========================================

        const allowedRoles = [
            "WAITER",
            "KITCHEN",
            
        ];

        if (!allowedRoles.includes(role)) {
            res.status(400).json({
                message: "Invalid staff role",
            });
            return;
        }

        // ========================================
        // VALIDATE EMAIL
        // ========================================

        const normalizedEmail =
            String(email)
                .trim()
                .toLowerCase();

        // ========================================
        // CHECK EXISTING STAFF
        // ========================================

        const existingStaff =
            await Staff.findOne({
                email: normalizedEmail,
            });

        if (existingStaff) {
            res.status(400).json({
                message:
                    "Staff with this email already exists",
            });
            return;
        }

        // ========================================
        // VALIDATE PASSWORD
        // ========================================

        if (String(password).length < 6) {
            res.status(400).json({
                message:
                    "Password must be at least 6 characters",
            });
            return;
        }

        // ========================================
        // HASH PASSWORD
        // ========================================

        const hashedPassword =
            await bcrypt.hash(
                String(password),
                10
            );

        // ========================================
        // CREATE STAFF
        // ========================================

        const staff = await Staff.create({
            name: String(name).trim(),

            image:
                typeof image === "string"
                    ? image.trim()
                    : "",

            email: normalizedEmail,

            phone: String(phone).trim(),

            password: hashedPassword,

            role,

            isActive: true,
        });

        // ========================================
        // REMOVE PASSWORD FROM RESPONSE
        // ========================================

        const staffResponse =
            staff.toObject();

        delete (
            staffResponse as {
                password?: string;
            }
        ).password;

        // ========================================
        // RESPONSE
        // ========================================

        res.status(201).json({
            message:
                "Staff created successfully",
            staff: staffResponse,
        });
    } catch (error) {
        console.error(
            "Create staff error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to create staff",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};

// ========================================
// GET ALL STAFF
// GET /api/staff
// ========================================

export const getAllStaff = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const staff = await Staff.find({})
            .select("-password")
            .sort({
                createdAt: -1,
            })
            .lean();

        res.status(200).json({
            staff,
        });
    } catch (error) {
        console.error(
            "Get staff error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch staff",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};

// ========================================
// GET STAFF BY ID
// GET /api/staff/:staffId
// ========================================

export const getStaffById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { staffId } = req.params;

        // ========================================
        // VALIDATE ID
        // ========================================

        if (
            typeof staffId !== "string" ||
            !mongoose.Types.ObjectId.isValid(
                staffId
            )
        ) {
            res.status(400).json({
                message:
                    "Invalid staff ID",
            });
            return;
        }

        // ========================================
        // FIND STAFF
        // ========================================

        const staff =
            await Staff.findById(
                staffId
            )
                .select("-password")
                .lean();

        if (!staff) {
            res.status(404).json({
                message:
                    "Staff not found",
            });
            return;
        }

        res.status(200).json({
            staff,
        });
    } catch (error) {
        console.error(
            "Get staff by ID error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch staff",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};

// ========================================
// UPDATE STAFF
// PATCH /api/staff/:staffId
// ========================================

export const updateStaff = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { staffId } = req.params;

        const {
            name,
            image,
            email,
            phone,
            password,
            role,
            isActive,
        } = req.body || {};

        // ========================================
        // VALIDATE ID
        // ========================================

        if (
            typeof staffId !== "string" ||
            !mongoose.Types.ObjectId.isValid(
                staffId
            )
        ) {
            res.status(400).json({
                message:
                    "Invalid staff ID",
            });
            return;
        }

        // ========================================
        // FIND STAFF
        // ========================================

        const staff =
            await Staff.findById(
                staffId
            );

        if (!staff) {
            res.status(404).json({
                message:
                    "Staff not found",
            });
            return;
        }

        // ========================================
        // UPDATE NAME
        // ========================================

        if (
            name !== undefined
        ) {
            if (
                typeof name !==
                    "string" ||
                !name.trim()
            ) {
                res.status(400).json({
                    message:
                        "Invalid staff name",
                });
                return;
            }

            staff.name =
                name.trim();
        }

        // ========================================
        // UPDATE IMAGE
        // ========================================

        if (
            image !== undefined
        ) {
            if (
                typeof image !==
                "string"
            ) {
                res.status(400).json({
                    message:
                        "Invalid image",
                });
                return;
            }

            staff.image =
                image.trim();
        }

        // ========================================
        // UPDATE EMAIL
        // ========================================

        if (
            email !== undefined
        ) {
            if (
                typeof email !==
                    "string" ||
                !email.trim()
            ) {
                res.status(400).json({
                    message:
                        "Invalid email",
                });
                return;
            }

            const normalizedEmail =
                email
                    .trim()
                    .toLowerCase();

            const emailExists =
                await Staff.findOne({
                    email:
                        normalizedEmail,
                    _id: {
                        $ne: staff._id,
                    },
                });

            if (emailExists) {
                res.status(400).json({
                    message:
                        "Email already belongs to another staff member",
                });
                return;
            }

            staff.email =
                normalizedEmail;
        }

        // ========================================
        // UPDATE PHONE
        // ========================================

        if (
            phone !== undefined
        ) {
            if (
                typeof phone !==
                    "string" ||
                !phone.trim()
            ) {
                res.status(400).json({
                    message:
                        "Invalid phone number",
                });
                return;
            }

            staff.phone =
                phone.trim();
        }

        // ========================================
        // UPDATE ROLE
        // ========================================

        if (
            role !== undefined
        ) {
            const allowedRoles = [
                "WAITER",
                "KITCHEN",
                
            ];

            if (
                !allowedRoles.includes(
                    role
                )
            ) {
                res.status(400).json({
                    message:
                        "Invalid staff role",
                });
                return;
            }

            staff.role = role;
        }

        // ========================================
        // UPDATE ACTIVE STATUS
        // ========================================

        if (
            isActive !== undefined
        ) {
            if (
                typeof isActive !==
                "boolean"
            ) {
                res.status(400).json({
                    message:
                        "Invalid staff status",
                });
                return;
            }

            staff.isActive =
                isActive;
        }

        // ========================================
        // UPDATE PASSWORD
        // ========================================

        if (
            password !== undefined
        ) {
            if (
                typeof password !==
                    "string" ||
                password.length < 6
            ) {
                res.status(400).json({
                    message:
                        "Password must be at least 6 characters",
                });
                return;
            }

            staff.password =
                await bcrypt.hash(
                    password,
                    10
                );
        }

        // ========================================
        // SAVE
        // ========================================

        await staff.save();

        // ========================================
        // REMOVE PASSWORD
        // ========================================

        const staffResponse =
            staff.toObject();

        delete (
            staffResponse as {
                password?: string;
            }
        ).password;

        // ========================================
        // RESPONSE
        // ========================================

        res.status(200).json({
            message:
                "Staff updated successfully",
            staff: staffResponse,
        });
    } catch (error) {
        console.error(
            "Update staff error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update staff",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};

// ========================================
// DEACTIVATE STAFF
// PATCH /api/staff/:staffId/deactivate
// ========================================

export const deactivateStaff = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { staffId } = req.params;

        if (
            typeof staffId !== "string" ||
            !mongoose.Types.ObjectId.isValid(
                staffId
            )
        ) {
            res.status(400).json({
                message:
                    "Invalid staff ID",
            });
            return;
        }

        const staff =
            await Staff.findByIdAndUpdate(
                staffId,
                {
                    isActive: false,
                },
                {
                    new: true,
                }
            )
                .select("-password");

        if (!staff) {
            res.status(404).json({
                message:
                    "Staff not found",
            });
            return;
        }

        res.status(200).json({
            message:
                "Staff deactivated successfully",
            staff,
        });
    } catch (error) {
        console.error(
            "Deactivate staff error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to deactivate staff",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};

// ========================================
// ACTIVATE STAFF
// PATCH /api/staff/:staffId/activate
// ========================================

export const activateStaff = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { staffId } = req.params;

        if (
            typeof staffId !== "string" ||
            !mongoose.Types.ObjectId.isValid(
                staffId
            )
        ) {
            res.status(400).json({
                message:
                    "Invalid staff ID",
            });
            return;
        }

        const staff =
            await Staff.findByIdAndUpdate(
                staffId,
                {
                    isActive: true,
                },
                {
                    new: true,
                }
            )
                .select("-password");

        if (!staff) {
            res.status(404).json({
                message:
                    "Staff not found",
            });
            return;
        }

        res.status(200).json({
            message:
                "Staff activated successfully",
            staff,
        });
    } catch (error) {
        console.error(
            "Activate staff error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to activate staff",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};

// ========================================
// DELETE STAFF
// DELETE /api/staff/:staffId
// ========================================

export const deleteStaff = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { staffId } = req.params;

        if (
            typeof staffId !== "string" ||
            !mongoose.Types.ObjectId.isValid(
                staffId
            )
        ) {
            res.status(400).json({
                message:
                    "Invalid staff ID",
            });
            return;
        }

        const staff =
            await Staff.findByIdAndDelete(
                staffId
            );

        if (!staff) {
            res.status(404).json({
                message:
                    "Staff not found",
            });
            return;
        }

        res.status(200).json({
            message:
                "Staff deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete staff error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete staff",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};