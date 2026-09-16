import mongoose, { Document, Schema } from "mongoose";

export interface IBillItem {
    menuItemId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    amount: number;
}

export interface IBill extends Document {
    orderId: mongoose.Types.ObjectId;
    tableId: mongoose.Types.ObjectId;
    tableNumber: number;
    items: IBillItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

const billItemSchema = new Schema<IBillItem>(
    {
        menuItemId: {
            type: Schema.Types.ObjectId,
            ref: "MenuItem",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
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
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

const billSchema = new Schema<IBill>(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true,
        },

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
            type: [billItemSchema],
            required: true,
            validate: {
                validator: (items: IBillItem[]) =>
                    items.length > 0,
                message:
                    "Bill must contain at least one item",
            },
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Bill = mongoose.model<IBill>(
    "Bill",
    billSchema
);

export default Bill;