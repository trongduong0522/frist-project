import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rootRouter from "./routers/index.router.js";

dotenv.config();

const app = express();

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// API routes
app.use("/api", rootRouter);

const port = process.env.PORT || 3001;

const PORT = process.env.PORT || 3001; // Render sẽ tự đưa port 10000 vào đây
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});