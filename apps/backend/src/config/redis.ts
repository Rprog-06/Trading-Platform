import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!);
export const redisSub = new Redis(process.env.REDIS_URL!);

redis.on("connect", () => {
  console.log("Redis connected (API Gateway)");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});
