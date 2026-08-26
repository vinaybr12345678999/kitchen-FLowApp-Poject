import mongoose, { Schema, Document } from "mongoose";

// Define the User structure
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
   role: "WAITER" | "KITCHEN" | "MANAGER";
isActive: boolean;
}

// Create User schema
const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            required: true,
            enum: ["WAITER", "KITCHEN", "MANAGER"]
        },
        isActive: {
    type: Boolean,
    default: true
}
    },
    {
        timestamps: true
    }
);

// Create User model
const User = mongoose.model<IUser>("User", userSchema, "Users");

export default User;