import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { redis } from "../config/redis";
import { authenticate, AuthRequest } from "../middlewares/auth";
import { orderSchema } from "./schemas/trading";
import { PrismaClient } from "@prisma/client";

const router = Router();

const prisma = new PrismaClient();

/**
 * POST /api/trading/orders
 * Publishes order command to Redis
 */
router.post("/orders", authenticate, async (req: AuthRequest, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  


  const orderId = uuidv4();

  const command = {
    orderId,
    userId: req.userId,
    symbol: parsed.data.symbol,
    side: parsed.data.side,
    type: parsed.data.type,
    quantity: parsed.data.quantity,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  };
    if(!req.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
 
  await prisma.orderCommand.create({
  data: {
     orderId,
    userId: req.userId,
    symbol: parsed.data.symbol,
    side: parsed.data.side,
    type: parsed.data.type,
    quantity: parsed.data.quantity,
    status: "SUCCESS"
  }


});


  await redis.publish(
    "commands:order:submit",
    JSON.stringify(command)
  );

  res.json(command);
});
router.get("/orders", authenticate, async (req: AuthRequest, res) => {
 const orders = await prisma.orderCommand.findMany({
    where: {
      userId: req.userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(orders);
});


export default router;
