import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!);
export const redisSub = new Redis(process.env.REDIS_URL!);

redisSub.subscribe("events:order:status");
redis.on("connect", () => {
  console.log("Redis connected (Execution Service)");
});
redisSub.on("message", (_, message) => {
  // handle message
});
redis.on("error", console.error);
