import { Request, Response } from "express";
import Table from "../models/table";

// Get all tables
export const getTables = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const tables = await Table.find().sort({ tableNumber: 1 });

        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch tables",
            error: error instanceof Error ? error.message : error,
        });
    }
};

// Create a new table
export const createTable = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { tableNumber, status } = req.body;

        const existingTable = await Table.findOne({ tableNumber });

        if (existingTable) {
            res.status(400).json({
                message: "Table number already exists",
            });
            return;
        }

        const table = await Table.create({
            tableNumber,
            status,
        });

        res.status(201).json({
            message: "Table created successfully",
            table,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create table",
            error: error instanceof Error ? error.message : error,
        });
    }
};

// Update table status
export const updateTableStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const table = await Table.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!table) {
            res.status(404).json({
                message: "Table not found",
            });
            return;
        }

        res.status(200).json({
            message: "Table status updated successfully",
            table,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update table status",
            error: error instanceof Error ? error.message : error,
        });
    }
};