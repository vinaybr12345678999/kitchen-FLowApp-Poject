
import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
    menuItemId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    instructions?: string;
}

export interface IOrder extends Document {
    tableId: mongoose.Types.ObjectId;
    tableNumber: number;
    items: IOrderItem[];
    totalAmount: number;

    status:
        | "NEW"
        | "PREPARING"
        | "READY"
        | "SERVED"
        | "PAID";

    createdAt: Date;
    updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
    {
        menuItemId: {
            type: Schema.Types.ObjectId,
            ref: "MenuItem",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        instructions: {
            type: String,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new Schema<IOrder>(
    {
        tableId: {
            type: Schema.Types.ObjectId,
            ref: "Table",
            required: true,
        },

        tableNumber: {
            type: Number,
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items: IOrderItem[]) =>
                    items.length > 0,
                message:
                    "Order must contain at least one item",
            },
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: [
                "NEW",
                "PREPARING",
                "READY",
                "SERVED",
                "PAID",
            ],
            default: "NEW",
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model<IOrder>(
    "Order",
    orderSchema
);

export default Order;

