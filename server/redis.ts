import { Redis } from '@upstash/redis'
export const redis = Redis.fromEnv()

await redis.set("foo", "bar");
await redis.get("foo");