import Redis from "ioredis";

export const subRedis = new Redis(process.env.REDIS_URL!);
export const pubRedis = new Redis(process.env.REDIS_URL!);

subRedis.on("connect", () => {
  console.log("Redis connected (subscriber)");
});

pubRedis.on("connect", () => {
  console.log("Redis connected (publisher)");
});