import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import rootRouter from "./routers/index.router.js";
const app = express();

// Kết nối db
mongoose.connect(`mongodb://localhost:27017/prist-project`);
// middlewar
app.use(cors());
app.use(express.json());
app.use("/api", rootRouter);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "API dang hoat dong",
        status: "ok"
    });
});


const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Route chạy thử để test Postman
// app.get("/test", (req, res) => {
//     res.status(200).json({
//         message: "Kết nối với Postman thành công!",
//         status: "Server đang hoạt động tốt"
//     });
// });
