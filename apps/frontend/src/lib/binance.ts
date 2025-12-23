import { CandlestickData, UTCTimestamp } from "lightweight-charts";
export const fetchCandles = async (
  symbol: string,
  interval = "1m"
): Promise<CandlestickData[]> => {
  const res = await fetch(
    `https://testnet.binance.vision/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`
  );

  const data = await res.json();

  return data.map((c: any) => ({
    time: (c[0] / 1000) as UTCTimestamp,
    open: Number(c[1]),
    high: Number(c[2]),
    low: Number(c[3]),
    close: Number(c[4])
  }));
};
