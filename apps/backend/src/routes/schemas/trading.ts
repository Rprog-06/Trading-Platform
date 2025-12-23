
import { z } from "zod";

export const orderSchema = z.object({
  symbol: z.string().min(3),
  side: z.enum(["BUY", "SELL"]),
  type: z.enum(["MARKET"]),
  quantity: z.number().positive()
});
