import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/order";
import Bill from "../models/bill";
import Table from "../models/table";

// ========================================
// GENERATE BILL
// POST /api/billing/:orderId
//
// ONE ORDER = ONE BILL
//
// Extra food:
// Existing Order 23 ge items add agutte
// Order 24 create agalla.
//
// Example:
//
// Order 23
//   Masal Dosa x2
//   Paneer Butter Masala x1
//   Paneer Tikka x2
//
// status = SERVED
//
// Generate bill
//
// ONE BILL -> ₹756
// Order 23 -> PAID
// Table -> AVAILABLE
// ========================================

export const generateBill = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const orderId = req.params.orderId;

        // ========================================
        // VALIDATE PARAMETER
        // ========================================

        if (
            !orderId ||
            Array.isArray(orderId)
        ) {
            res.status(400).json({
                message: "Order ID is required",
            });
            return;
        }

        // ========================================
        // VALIDATE MONGODB OBJECT ID
        // ========================================

        if (
            !mongoose.Types.ObjectId.isValid(
                orderId
            )
        ) {
            res.status(400).json({
                message: "Invalid order ID",
            });
            return;
        }

        // ========================================
        // FIND ORDER
        // ========================================

        const order =
            await Order.findById(orderId);

        if (!order) {
            res.status(404).json({
                message: "Order not found",
            });
            return;
        }

        // ========================================
        // ORDER MUST BE SERVED
        // ========================================

        if (order.status !== "SERVED") {
            res.status(400).json({
                message:
                    "Bill can be generated only after the order is served",
            });
            return;
        }

        // ========================================
        // CHECK ITEMS
        // ========================================

        if (
            !order.items ||
            order.items.length === 0
        ) {
            res.status(400).json({
                message:
                    "Order has no items",
            });
            return;
        }

        // ========================================
        // CHECK EXISTING BILL
        //
        // IMPORTANT:
        // Same Order ID -> same bill
        //
        // If bill already exists, don't create
        // another bill.
        // ========================================

        const existingBills =
            await Bill.find({}).lean();

        const existingBill =
            existingBills.find(
                (bill) =>
                    bill.orderId?.toString() ===
                    order._id.toString()
            );

        if (existingBill) {
            res.status(200).json({
                message:
                    "Bill already generated",
                bill: existingBill,
            });
            return;
        }

        // ========================================
        // CREATE BILL ITEMS
        // ========================================

        const billItems = order.items.map(
            (item) => ({
                menuItemId:
                    item.menuItemId,

                name:
                    item.name,

                price:
                    item.price,

                quantity:
                    item.quantity,

                amount:
                    item.price *
                    item.quantity,
            })
        );

        // ========================================
        // CALCULATE TOTAL
        // ========================================

        const totalAmount =
            billItems.reduce(
                (total, item) => {
                    return (
                        total +
                        item.amount
                    );
                },
                0
            );

        // ========================================
        // CREATE BILL
        // ========================================

        const bill =
            await Bill.create({
                orderId:
                    order._id,

                tableId:
                    order.tableId,

                tableNumber:
                    order.tableNumber,

                items:
                    billItems,

                totalAmount:
                    totalAmount,
            });

        // ========================================
        // ORDER -> PAID
        // ========================================

        order.status = "PAID";

        order.totalAmount =
            totalAmount;

        await order.save();

        // ========================================
        // TABLE -> AVAILABLE
        // ========================================

        const table =
            await Table.findById(
                order.tableId
            );

        if (table) {
            table.status =
                "AVAILABLE";

            await table.save();
        }

        // ========================================
        // SUCCESS
        // ========================================

        res.status(201).json({
            message:
                "Bill generated successfully",

            bill,
        });
    } catch (error) {
        console.error(
            "================================"
        );

        console.error(
            "GENERATE BILL ERROR:"
        );

        console.error(error);

        console.error(
            "================================"
        );

        res.status(500).json({
            message:
                "Failed to generate bill",

            error:
                error instanceof Error
                    ? error.message
                    : String(error),
        });
    }
};

// ========================================
// GET BILL BY ORDER
// GET /api/billing/:orderId
// ========================================

export const getBillByOrder = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const orderId = req.params.orderId;

        // ========================================
        // VALIDATE PARAMETER
        // ========================================

        if (
            !orderId ||
            Array.isArray(orderId)
        ) {
            res.status(400).json({
                message:
                    "Order ID is required",
            });
            return;
        }

        // ========================================
        // VALIDATE OBJECT ID
        // ========================================

        if (
            !mongoose.Types.ObjectId.isValid(
                orderId
            )
        ) {
            res.status(400).json({
                message:
                    "Invalid order ID",
            });
            return;
        }

        // ========================================
        // FIND BILL
        // ========================================

        const bills =
            await Bill.find({}).lean();

        const bill =
            bills.find(
                (item) =>
                    item.orderId?.toString() ===
                    orderId
            );

        // ========================================
        // NOT FOUND
        // ========================================

        if (!bill) {
            res.status(404).json({
                message:
                    "Bill not found",
            });
            return;
        }

        // ========================================
        // RESPONSE
        // ========================================

        res.status(200).json({
            bill,
        });
    } catch (error) {
        console.error(
            "Get bill error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch bill",

            error:
                error instanceof Error
                    ? error.message
                    : String(error),
        });
    }
};