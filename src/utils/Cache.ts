import RedisCacheHelper from './RedisHelper';

const redis = new RedisCacheHelper();

class Cache {
  public async get(key: string) {
    const data = await redis.getFromCache(key);
    return JSON.parse(data);
  }

  public async set(key: string, data: any) {
    redis.storeInCache(key, data);
  }

  public verifyData() {
    return true;
  }

  public formatCachedData(data: any) {
    return data;
  }

  public clear(key: string) {
    redis.clearCacheForKeys([key]);
  }
}

export default Cache;
