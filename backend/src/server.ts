// import express from "express";
// import cors from "cors";

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/api", (req, res) => {
//     res.json({
//         message: "KitchenFlow Backend is running",
//     });
// });

// const PORT = 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
//to connecct with atlas
import dns from "node:dns/promises";
dns.setServers(["8.8.8.8","1.1.1.1"]);

//import authroutes
import authRoutes from "./routes/authRoutes"
import { Server } from "node:tls";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("KitchenFlow API is running ");
});

//add auth route
app.use("/api/auth", authRoutes);

// Server
const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});