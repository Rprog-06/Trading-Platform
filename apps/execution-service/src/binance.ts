import axios from "axios";
import crypto from "crypto";

const BASE_URL = "https://testnet.binance.vision";

export const placeMarketOrder = async (
  apiKey: string,
  secret: string,
  symbol: string,
  side: "BUY" | "SELL",
  quantity: number
) => {
  const timestamp = Date.now();
  const query = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(query)
    .digest("hex");

  const res = await axios.post(
    `${BASE_URL}/api/v3/order?${query}&signature=${signature}`,
    null,
    { headers: { "X-MBX-APIKEY": apiKey } }
  );

  return res.data;
};
