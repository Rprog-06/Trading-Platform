import { subRedis, pubRedis } from "./redis";
import { placeMarketOrder } from "./binance";
import { PrismaClient } from "@prisma/client";
import { decrypt } from "./encryption";

const prisma = new PrismaClient();

subRedis.subscribe("commands:order:submit");

subRedis.on("message", async (_, message) => {
   console.log("📥 Execution received command:", message);
  const command = JSON.parse(message);
  

  try {
    const user = await prisma.user.findUnique({
      where: { id: command.userId }
    });

    const apiKey = decrypt(user!.binanceApiKeyEnc);
    const secret = decrypt(user!.binanceSecretEnc);
     await new Promise((res) => setTimeout(res, 2000));

    const result = await placeMarketOrder(
      apiKey,
      secret,
      command.symbol,
      command.side,
      command.quantity
    );

    await pubRedis.publish(
      "events:order:status",
      JSON.stringify({
        orderId: command.orderId,
        userId: command.userId,
        status: "FILLED",
        symbol: command.symbol,
        price: result.fills?.[0]?.price,
        quantity: command.quantity,
        timestamp: new Date().toISOString()
      })
    );
  } catch (err) {
    await pubRedis.publish(
      "events:order:status",
      JSON.stringify({
        orderId: command.orderId,
        userId: command.userId,
        status: "REJECTED",
        reason: "Execution failed"
      })
    );
  }
});
