import { Request, Response } from "express";

import Order from "../models/order";
import MenuItem from "../models/menuitem";
import Table from "../models/table";

// ========================================
// CREATE / ADD ORDER
// POST /api/orders
//
// IMPORTANT:
//
// First order:
// Table AVAILABLE
//     ↓
// Create Order #23
//
// Extra order:
// Table OCCUPIED
//     ↓
// DO NOT create Order #24
//     ↓
// Add items into existing Order #23
//
// Therefore order count remains same.
// ========================================

export const createOrder = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            tableId,
            tableNumber,
            items,
        } = req.body || {};

        // ========================================
        // VALIDATE REQUEST
        // ========================================

        if (
            !tableId ||
            tableNumber === undefined ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            res.status(400).json({
                message:
                    "Table and order items are required",
            });

            return;
        }

        // ========================================
        // VALIDATE TABLE NUMBER
        // ========================================

        if (
            typeof tableNumber !== "number"
        ) {
            res.status(400).json({
                message:
                    "Invalid table number",
            });

            return;
        }

        // ========================================
        // FIND TABLE
        // ========================================

        const table =
            await Table.findById(tableId);

        if (!table) {
            res.status(404).json({
                message:
                    "Table not found",
            });

            return;
        }

        // ========================================
        // PREPARE ITEMS
        // ========================================

        const orderItems: any[] = [];

        for (const item of items) {
            // ========================================
            // MENU ITEM ID
            // ========================================

            if (!item.menuItemId) {
                res.status(400).json({
                    message:
                        "Menu item ID is required",
                });

                return;
            }

            // ========================================
            // FIND MENU ITEM
            // ========================================

            const menuItem =
                await MenuItem.findById(
                    item.menuItemId
                );

            if (!menuItem) {
                res.status(404).json({
                    message:
                        `Menu item not found: ${item.menuItemId}`,
                });

                return;
            }

            // ========================================
            // CHECK AVAILABILITY
            // ========================================

            if (
                !menuItem.isAvailable
            ) {
                res.status(400).json({
                    message:
                        `${menuItem.name} is not available`,
                });

                return;
            }

            // ========================================
            // VALIDATE QUANTITY
            // ========================================

            if (
                typeof item.quantity !==
                    "number" ||
                !Number.isInteger(
                    item.quantity
                ) ||
                item.quantity < 1
            ) {
                res.status(400).json({
                    message:
                        `Invalid quantity for ${menuItem.name}`,
                });

                return;
            }

            // ========================================
            // ADD ITEM
            // ========================================

            orderItems.push({
                menuItemId:
                    menuItem._id,

                name:
                    menuItem.name,

                price:
                    menuItem.price,

                quantity:
                    item.quantity,

                instructions:
                    typeof item.instructions ===
                    "string"
                        ? item.instructions.trim()
                        : "",
            });
        }

        // ========================================
        // CALCULATE NEW ITEMS TOTAL
        // ========================================

        const newItemsTotal =
            orderItems.reduce(
                (
                    total,
                    item
                ) => {
                    return (
                        total +
                        item.price *
                            item.quantity
                    );
                },
                0
            );

        // ========================================
        // FIND CURRENT TABLE SESSION
        //
        // IMPORTANT:
        //
        // Find unpaid order for this table.
        //
        // PAID orders are ignored.
        //
        // This is what prevents:
        //
        // Order 23
        // Extra order -> Order 24
        //
        // Instead:
        //
        // Order 23
        // Extra order -> same Order 23
        // ========================================

        const existingOrder =
            await Order.findOne({
                tableId,
                status: {
                    $ne: "PAID",
                },
            }).sort({
                createdAt: -1,
            });

        // ========================================
        // EXTRA ORDER
        // ========================================

        if (existingOrder) {
            // ------------------------------------
            // Add items to complete order
            // ------------------------------------

            existingOrder.items.push(
                ...orderItems
            );

            // ------------------------------------
            // Add items to pendingItems
            //
            // Kitchen sees only these new items.
            // ------------------------------------

            existingOrder.pendingItems.push(
                ...orderItems
            );

            // ------------------------------------
            // Add new amount
            // ------------------------------------

            existingOrder.totalAmount +=
                newItemsTotal;

            // ------------------------------------
            // IMPORTANT
            //
            // Existing order could be:
            //
            // SERVED
            //
            // Extra food comes.
            //
            // We move it back to NEW so kitchen
            // can process the extra food.
            // ------------------------------------

            existingOrder.status =
                "NEW";

            await existingOrder.save();

            // ------------------------------------
            // Table remains occupied
            // ------------------------------------

            if (
                table.status !==
                "OCCUPIED"
            ) {
                table.status =
                    "OCCUPIED";

                await table.save();
            }

            res.status(200).json({
                message:
                    "Extra items added to existing order",
                order:
                    existingOrder,
                isExtraOrder:
                    true,
            });

            return;
        }

        // ========================================
        // FIRST ORDER
        // ========================================

        const order =
            await Order.create({
                tableId,

                tableNumber,

                items:
                    orderItems,

                pendingItems:
                    orderItems,

                totalAmount:
                    newItemsTotal,

                status:
                    "NEW",
            });

        // ========================================
        // TABLE -> OCCUPIED
        // ========================================

        if (
            table.status !==
            "OCCUPIED"
        ) {
            table.status =
                "OCCUPIED";

            await table.save();
        }

        // ========================================
        // RESPONSE
        // ========================================

        res.status(201).json({
            message:
                "Order placed successfully",

            order,

            isExtraOrder:
                false,
        });
    } catch (error) {
        console.error(
            "Create order error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to place order",

            error:
                error instanceof Error
                    ? error.message
                    : error,
        });
    }
};

// ========================================
// GET ACTIVE ORDERS
// GET /api/orders/active
//
// Kitchen + Waiter
//
// IMPORTANT:
//
// For kitchen:
//
// pendingItems are returned.
//
// So if old order had:
//
// Masala Dosa × 2
//
// and customer adds:
//
// Paneer × 1
//
// Kitchen gets only:
//
// Paneer × 1
//
// ========================================

export const getActiveOrders = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const orders =
            await Order.find({
                status: {
                    $in: [
                        "NEW",
                        "PREPARING",
                        "READY",
                        "SERVED",
                    ],
                },
            })
                .sort({
                    createdAt: 1,
                })
                .lean();

        const activeOrders =
            orders.map(
                (order) => ({
                    _id:
                        order._id,

                    tableId:
                        order.tableId,

                    tableNumber:
                        order.tableNumber,

                    status:
                        order.status,

                    // --------------------------------
                    // IMPORTANT
                    //
                    // Kitchen gets pending items.
                    // --------------------------------

                    items:
                        order.pendingItems &&
                        order.pendingItems.length >
                            0
                            ? order.pendingItems.map(
                                  (
                                      item
                                  ) => ({
                                      name:
                                          item.name,

                                      quantity:
                                          item.quantity,

                                      instructions:
                                          item.instructions ||
                                          "",
                                  })
                              )
                            : order.items.map(
                                  (
                                      item
                                  ) => ({
                                      name:
                                          item.name,

                                      quantity:
                                          item.quantity,

                                      instructions:
                                          item.instructions ||
                                          "",
                                  })
                              ),

                    createdAt:
                        order.createdAt,
                })
            );

        res.status(200).json(
            activeOrders
        );
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
// GET /api/orders/all
//
// Manager
//
// IMPORTANT:
//
// One table session = one order.
//
// Extra food does NOT create another order.
// ========================================

export const getAllOrders = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const orders =
            await Order.find({})
                .sort({
                    createdAt: 1,
                })
                .lean();

        res.status(200).json(
            orders
        );
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
// PATCH /api/orders/:orderId/status
//
// NEW -> PREPARING
// PREPARING -> READY
// READY -> SERVED
//
// ========================================

export const updateOrderStatus =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            // ========================================
            // FIX TS ERROR
            // ========================================

            const orderId =
                Array.isArray(
                    req.params.orderId
                )
                    ? req.params.orderId[0]
                    : req.params.orderId;

            const {
                status,
            } = req.body || {};

            // ========================================
            // ALLOWED STATUS
            // ========================================

            const allowedStatuses = [
                "NEW",
                "PREPARING",
                "READY",
                "SERVED",
            ];

            if (
                typeof status !==
                    "string" ||
                !allowedStatuses.includes(
                    status
                )
            ) {
                res.status(400).json({
                    message:
                        "Invalid order status",
                });

                return;
            }

            // ========================================
            // FIND ORDER
            // ========================================

            const order =
                await Order.findById(
                    orderId
                );

            if (!order) {
                res.status(404).json({
                    message:
                        "Order not found",
                });

                return;
            }

            // ========================================
            // PAID CANNOT CHANGE
            // ========================================

            if (
                order.status ===
                "PAID"
            ) {
                res.status(400).json({
                    message:
                        "Paid order cannot be changed",
                });

                return;
            }

            // ========================================
            // STATUS FLOW
            // ========================================

            const nextStatus:
                Record<
                    string,
                    string
                > = {
                    NEW: "PREPARING",

                    PREPARING:
                        "READY",

                    READY:
                        "SERVED",
                };

            if (
                nextStatus[
                    order.status
                ] !== status
            ) {
                res.status(400).json({
                    message:
                        `Cannot move order from ${order.status} to ${status}`,
                });

                return;
            }

            // ========================================
            // UPDATE STATUS
            // ========================================

            order.status =
                status as
                    | "NEW"
                    | "PREPARING"
                    | "READY"
                    | "SERVED"
                    | "PAID";

            // ========================================
            // IMPORTANT:
            //
            // When kitchen starts processing NEW,
            // pendingItems remain.
            //
            // When waiter SERVES the order,
            // pendingItems can be cleared.
            //
            // Because those items have now been
            // served and already exist in `items`.
            // ========================================

            if (
                status ===
                "SERVED"
            ) {
                order.pendingItems =
                    [];
            }

            await order.save();

            // ========================================
            // RESPONSE
            // ========================================

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