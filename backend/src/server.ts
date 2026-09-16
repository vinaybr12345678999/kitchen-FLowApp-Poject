// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db";

// // To connect with Atlas
// import dns from "node:dns/promises";
// dns.setServers(["8.8.8.8", "1.1.1.1"]);

// // Routes
// import authRoutes from "./routes/authRoutes";
// import tableRoutes from "./routes/tableRoutes";
// import menuRoutes from "./routes/menuRoutes";
// import orderRoutes from "./routes/orderRoutes";
// import billingRoutes from "./routes/billingRoutes";
// import staffRoutes from "./routes/staffRoutes";
// import userRoutes from "./routes/userRoutes";

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Test route
// app.get("/", (req, res) => {
//     res.send("KitchenFlow API is running");
// });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/tables", tableRoutes);
// app.use("/api/menu-items", menuRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/billing", billingRoutes);
// app.use("/api/staff", staffRoutes);
// app.use("/api/users", userRoutes);
// // Server
// const PORT = process.env.PORT || 5000;

// connectDB();

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";

import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import authRoutes from "./routes/authRoutes";
import tableRoutes from "./routes/tableRoutes";
import menuRoutes from "./routes/menuRoutes";
import orderRoutes from "./routes/orderRoutes";
import billingRoutes from "./routes/billingRoutes";
import staffRoutes from "./routes/staffRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("KitchenFlow API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/menu-items", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/users", userRoutes);

// Server
const PORT = Number(process.env.PORT) || 5000;

connectDB();

app.listen(
    PORT,
    "0.0.0.0",
    () => {
        console.log(
            `Server running on http://0.0.0.0:${PORT}`
        );

        console.log(
            `Network API: http://192.168.1.7:${PORT}`
        );
    }
);