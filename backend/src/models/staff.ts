import mongoose, { Document, Schema } from "mongoose";

// ========================================
// STAFF INTERFACE
// ========================================

export interface IStaff extends Document {
    name: string;
    image: string;
    email: string;
    phone: string;
    password: string;

    // Staff roles ONLY
    role: "WAITER" | "KITCHEN";

    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ========================================
// STAFF SCHEMA
// ========================================

const staffSchema = new Schema<IStaff>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            default: "",
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        // Staff role only
        role: {
            type: String,
            enum: ["WAITER", "KITCHEN"],
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// ========================================
// MODEL
// ========================================

const Staff = mongoose.model<IStaff>(
    "Staff",
    staffSchema
);

export default Staff;