import { redisClient } from "./redis.client.js";

export const getOrSetCache = async <T>(
  key: string,
  ttlSeconds: number,
  fetchData: () => Promise<T>,
): Promise<T> => {
  const cachedData = await redisClient.get(key);

  if (cachedData !== null) {
    console.log(`[Redis] Cache HIT: ${key}`);
    return JSON.parse(cachedData) as T;
  }

  console.log(`[Redis] Cache MISS: ${key}`);

  const freshData = await fetchData();

  await redisClient.set(key, JSON.stringify(freshData), {
    EX: ttlSeconds,
  });

  return freshData;
};
