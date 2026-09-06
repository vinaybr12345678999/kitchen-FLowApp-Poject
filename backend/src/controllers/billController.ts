
import { Request, Response } from "express";
import Order from "../models/order";
import Bill from "../models/bill";
import Table from "../models/table";

// ========================================
// GENERATE BILL
// POST /api/billing/:orderId
// ========================================

export const generateBill = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { orderId } = req.params;

        // Find order
        const order = await Order.findById(orderId);

        if (!order) {
            res.status(404).json({
                message: "Order not found",
            });
            return;
        }

        // ========================================
        // CHECK IF BILL ALREADY EXISTS
        // ========================================

        const existingBill = await Bill.findOne({
            orderId: order._id,
        });

        if (existingBill) {
            // Make table available
            const table = await Table.findById(
                order.tableId
            );

            if (table) {
                table.status = "AVAILABLE";
                await table.save();
            }

            // Make order PAID
            if (order.status !== "PAID") {
                order.status = "PAID";
                await order.save();
            }

            res.status(200).json({
                message: "Bill already generated",
                bill: existingBill,
            });

            return;
        }

        // ========================================
        // BILL ONLY AFTER SERVED
        // ========================================

        if (order.status !== "SERVED") {
            res.status(400).json({
                message:
                    "Bill can be generated only after the order is served",
            });

            return;
        }

        // ========================================
        // CREATE BILL ITEMS
        // ========================================

        const billItems = order.items.map((item) => ({
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            amount:
                item.price * item.quantity,
        }));

        // ========================================
        // CALCULATE TOTAL
        // ========================================

        const totalAmount = billItems.reduce(
            (total, item) => {
                return total + item.amount;
            },
            0
        );

        // ========================================
        // CREATE BILL
        // ========================================

        const bill = await Bill.create({
            orderId: order._id,
            tableId: order.tableId,
            tableNumber: order.tableNumber,
            items: billItems,
            totalAmount,
        });

        // ========================================
        // ORDER → PAID
        // ========================================

        order.status = "PAID";
        await order.save();

        // ========================================
        // TABLE → AVAILABLE
        // ========================================

        const table = await Table.findById(
            order.tableId
        );

        if (table) {
            table.status = "AVAILABLE";
            await table.save();
        }

        // ========================================
        // RESPONSE
        // ========================================

        res.status(201).json({
            message:
                "Bill generated successfully",
            bill,
        });
    } catch (error) {
        console.error(
            "Generate bill error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to generate bill",
            error:
                error instanceof Error
                    ? error.message
                    : error,
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
        const { orderId } = req.params;

        const bill = await Bill.findOne({
            orderId,
        });

        if (!bill) {
            res.status(404).json({
                message: "Bill not found",
            });
            return;
        }

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
                    : error,
        });
    }
};
