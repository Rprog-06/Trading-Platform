import express from "express";
import cors from "cors";
import healthRouter from "./routes/health";
import authRoutes from "./routes/auth";
import tradingRoutes from "./routes/trading";

const app = express();

app.use(cors({
  origin:[  "http://localhost:3000",
     "https://trading-platform-frontend-sigma.vercel.app"],
    credentials: true,
}));
app.use(express.json());
app.use("/api", healthRouter);
app.use("/auth", authRoutes);
app.use("/api/trading", tradingRoutes);
export default app;
