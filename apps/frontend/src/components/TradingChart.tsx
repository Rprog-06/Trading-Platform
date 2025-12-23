"use client";
import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  CandlestickData
} from "lightweight-charts";

export default function TradingChart({
  candles
}: {
  candles: CandlestickData[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      height: 400,
      layout: {
        background: { color: "#0f172a" },
        textColor: "#e5e7eb"
      }
    });

    seriesRef.current = chartRef.current.addSeries(CandlestickSeries);
  }, []);

  useEffect(() => {
    if (seriesRef.current && candles.length > 0) {
      seriesRef.current.setData(candles); // ✅ now valid
    }
  }, [candles]);

  return <div ref={containerRef} className="w-full" />;
}
