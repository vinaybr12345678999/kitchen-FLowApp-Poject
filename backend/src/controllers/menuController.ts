import { Request, Response } from "express";
import MenuItem from "../models/menuitem";

// ========================================
// Create New Menu Item
// MANAGER ONLY - protected in route
// ========================================

export const createMenuItem = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            name,
            category,
            price,
            image,
            isAvailable,
        } = req.body;

        // Validate required fields
        if (
            !name ||
            !category ||
            price === undefined ||
            !image
        ) {
            res.status(400).json({
                message:
                    "Name, category, price and image are required",
            });
            return;
        }

        // Validate price
        if (
            typeof price !== "number" ||
            price < 0
        ) {
            res.status(400).json({
                message: "Price must be a valid positive number",
            });
            return;
        }

        const menuItem = await MenuItem.create({
            name: name.trim(),
            category: category.trim(),
            price,
            image: image.trim(),
            isAvailable:
                isAvailable !== undefined
                    ? isAvailable
                    : true,
        });

        res.status(201).json({
            message: "Menu item created successfully",
            menuItem,
        });

    } catch (error) {
        console.error(
            "Create menu item error:",
            error
        );

        res.status(500).json({
            message: "Failed to create menu item",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};


// ========================================
// Get All Menu Items
// WAITER + KITCHEN + MANAGER
// ========================================

export const getMenuItems = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const menuItems = await MenuItem
            .find()
            .sort({ name: 1 });

        res.status(200).json(menuItems);

    } catch (error) {
        console.error(
            "Get menu items error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch menu items",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};


// ========================================
// Update Menu Item
// MANAGER ONLY - protected in route
// ========================================

export const updateMenuItem = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        const {
            name,
            category,
            price,
            image,
            isAvailable,
        } = req.body;

        const updateData: {
            name?: string;
            category?: string;
            price?: number;
            image?: string;
            isAvailable?: boolean;
        } = {};

        // Name
        if (name !== undefined) {
            if (
                typeof name !== "string" ||
                !name.trim()
            ) {
                res.status(400).json({
                    message: "Invalid menu item name",
                });
                return;
            }

            updateData.name = name.trim();
        }

        // Category
        if (category !== undefined) {
            if (
                typeof category !== "string" ||
                !category.trim()
            ) {
                res.status(400).json({
                    message: "Invalid category",
                });
                return;
            }

            updateData.category = category.trim();
        }

        // Price
        if (price !== undefined) {
            if (
                typeof price !== "number" ||
                price < 0
            ) {
                res.status(400).json({
                    message:
                        "Price must be a valid positive number",
                });
                return;
            }

            updateData.price = price;
        }

        // Image
        if (image !== undefined) {
            if (
                typeof image !== "string" ||
                !image.trim()
            ) {
                res.status(400).json({
                    message: "Invalid image",
                });
                return;
            }

            updateData.image = image.trim();
        }

        // Availability
        if (isAvailable !== undefined) {
            if (
                typeof isAvailable !== "boolean"
            ) {
                res.status(400).json({
                    message:
                        "isAvailable must be true or false",
                });
                return;
            }

            updateData.isAvailable =
                isAvailable;
        }

        // Check if there is something to update
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({
                message: "No fields provided for update",
            });
            return;
        }

        const menuItem =
            await MenuItem.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!menuItem) {
            res.status(404).json({
                message: "Menu item not found",
            });
            return;
        }

        res.status(200).json({
            message:
                "Menu item updated successfully",
            menuItem,
        });

    } catch (error) {
        console.error(
            "Update menu item error:",
            error
        );

        res.status(500).json({
            message: "Failed to update menu item",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};


// ========================================
// Delete Menu Item
// MANAGER ONLY - protected in route
// ========================================

export const deleteMenuItem = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        const menuItem =
            await MenuItem.findByIdAndDelete(id);

        if (!menuItem) {
            res.status(404).json({
                message: "Menu item not found",
            });
            return;
        }

        res.status(200).json({
            message:
                "Menu item deleted successfully",
            menuItem,
        });

    } catch (error) {
        console.error(
            "Delete menu item error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete menu item",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};