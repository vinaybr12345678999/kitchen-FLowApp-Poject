import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";

const createManager = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected");

        const name = "Restaurant Manager";
        const email = "manager@restaurant.com";
        const password = "123456";

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // Find existing manager
        const existingManager = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingManager) {
            // UPDATE EXISTING MANAGER
            existingManager.name = name;
            existingManager.password = hashedPassword;
            existingManager.role = "MANAGER";
            existingManager.isActive = true;

            await existingManager.save();

            console.log("================================");
            console.log("Manager updated successfully");
            console.log("Email:", existingManager.email);
            console.log("Password:", password);
            console.log("Role:", existingManager.role);
            console.log("Active:", existingManager.isActive);
            console.log("================================");

            await mongoose.disconnect();
            process.exit(0);
        }

        // CREATE NEW MANAGER
        const manager = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "MANAGER",
            isActive: true,
        });

        console.log("================================");
        console.log("Manager created successfully");
        console.log("Email:", manager.email);
        console.log("Password:", password);
        console.log("Role:", manager.role);
        console.log("Active:", manager.isActive);
        console.log("================================");

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("Manager setup error:", error);

        await mongoose.disconnect();
        process.exit(1);
    }
};

createManager();