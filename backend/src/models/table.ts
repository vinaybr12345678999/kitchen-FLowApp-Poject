import mongoose, { Document, Schema } from "mongoose";

export interface ITable extends Document {
    tableNumber: number;
    status: "AVAILABLE" | "OCCUPIED";
}

const tableSchema = new Schema<ITable>(
    {
        tableNumber: {
            type: Number,
            required: true,
            unique: true,
        },

        status: {
            type: String,
            enum: ["AVAILABLE", "OCCUPIED"],
            default: "AVAILABLE",
        },
    },
    {
        timestamps: true,
    }
);

const Table = mongoose.model<ITable>("Table", tableSchema);

export default Table;
