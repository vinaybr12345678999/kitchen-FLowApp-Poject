import { Request, Response } from "express";
import Order from "../models/order";
import MenuItem from "../models/menuitem";
import Table from "../models/table";

// ========================================
// CREATE NEW ORDER
// POST /api/orders
// ========================================

export const createOrder = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { tableId, tableNumber, items } = req.body || {};

        // Validate request
        if (
            !tableId ||
            tableNumber === undefined ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            res.status(400).json({
                message: "Table and order items are required",
            });
            return;
        }

        // Validate table number
        if (typeof tableNumber !== "number") {
            res.status(400).json({
                message: "Invalid table number",
            });
            return;
        }

        // Find table
        const table = await Table.findById(tableId);

        if (!table) {
            res.status(404).json({
                message: "Table not found",
            });
            return;
        }

        // Check table availability
        if (table.status === "OCCUPIED") {
            res.status(400).json({
                message: "Table is already occupied",
            });
            return;
        }

        // Prepare order items
        const orderItems: any[] = [];

        for (const item of items) {
            // Check menu item ID
            if (!item.menuItemId) {
                res.status(400).json({
                    message: "Menu item ID is required",
                });
                return;
            }

            // Find menu item
            const menuItem = await MenuItem.findById(
                item.menuItemId
            );

            if (!menuItem) {
                res.status(404).json({
                    message:
                        `Menu item not found: ${item.menuItemId}`,
                });
                return;
            }

            // Check menu availability
            if (!menuItem.isAvailable) {
                res.status(400).json({
                    message:
                        `${menuItem.name} is not available`,
                });
                return;
            }

            // Validate quantity
            if (
                typeof item.quantity !== "number" ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
            ) {
                res.status(400).json({
                    message:
                        `Invalid quantity for ${menuItem.name}`,
                });
                return;
            }

            // Add order item
            orderItems.push({
                menuItemId: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity,
                instructions:
                    typeof item.instructions === "string"
                        ? item.instructions.trim()
                        : "",
            });
        }

        // Calculate total amount
        const totalAmount = orderItems.reduce(
            (total, item) => {
                return (
                    total +
                    item.price * item.quantity
                );
            },
            0
        );

        // Create order
        const order = await Order.create({
            tableId,
            tableNumber,
            items: orderItems,
            totalAmount,
            status: "NEW",
        });

        // Mark table as occupied
        table.status = "OCCUPIED";

        await table.save();

        // Response
        res.status(201).json({
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        console.error(
            "Create order error:",
            error
        );

        res.status(500).json({
            message: "Failed to place order",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};

// ========================================
// GET ACTIVE ORDERS
// Kitchen + Waiter
//
// NEW
// PREPARING
// READY
// SERVED
//
// GET /api/orders/active
// ========================================

export const getActiveOrders = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const orders = await Order.find({
            status: {
                $in: [
                    "NEW",
                    "PREPARING",
                    "READY",
                    "SERVED",
                ],
            },
        })
            .sort({ createdAt: 1 })
            .lean();

        const activeOrders = orders.map(
            (order) => ({
                _id: order._id,
                tableId: order.tableId,
                tableNumber: order.tableNumber,
                status: order.status,

                items: order.items.map(
                    (item) => ({
                        name: item.name,
                        quantity: item.quantity,
                        instructions:
                            item.instructions || "",
                    })
                ),

                createdAt: order.createdAt,
            })
        );

        res.status(200).json(activeOrders);
    } catch (error) {
        console.error(
            "Get active orders error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch active orders",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};

// ========================================
// GET ALL ORDERS
// Manager
//
// NEW
// PREPARING
// READY
// SERVED
// PAID
//
// GET /api/orders/all
// ========================================

export const getAllOrders = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: 1 })
            .lean();

        res.status(200).json(orders);
    } catch (error) {
        console.error(
            "Get all orders error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch all orders",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};

// ========================================
// UPDATE ORDER STATUS
//
// NEW → PREPARING
// PREPARING → READY
// READY → SERVED
//
// PAID is handled by billing controller
//
// PATCH /api/orders/:orderId/status
// ========================================

export const updateOrderStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { orderId } = req.params;
        const { status } = req.body || {};

        // Only kitchen/order workflow statuses
        // are allowed here.
        //
        // PAID should NOT be manually changed
        // from this endpoint.

        const allowedStatuses = [
            "NEW",
            "PREPARING",
            "READY",
            "SERVED",
        ];

        // Validate status
        if (
            typeof status !== "string" ||
            !allowedStatuses.includes(status)
        ) {
            res.status(400).json({
                message: "Invalid order status",
            });
            return;
        }

        // Find order
        const order = await Order.findById(
            orderId
        );

        if (!order) {
            res.status(404).json({
                message: "Order not found",
            });
            return;
        }

        // Paid order is final
        if (order.status === "PAID") {
            res.status(400).json({
                message:
                    "Paid order cannot be changed",
            });
            return;
        }

        // Define correct order flow
        const nextStatus: Record<
            string,
            string
        > = {
            NEW: "PREPARING",
            PREPARING: "READY",
            READY: "SERVED",
        };

        // Prevent skipping stages
        if (
            nextStatus[order.status] !== status
        ) {
            res.status(400).json({
                message:
                    `Cannot move order from ${order.status} to ${status}`,
            });
            return;
        }

        // Update status
        order.status = status as
            | "NEW"
            | "PREPARING"
            | "READY"
            | "SERVED"
            | "PAID";

        await order.save();

        res.status(200).json({
            message:
                "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.error(
            "Update order status error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update order status",
            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};