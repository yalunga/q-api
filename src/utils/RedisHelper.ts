import * as redis from 'redis';
import config from '../config';
import { promisify } from 'util';

const redisNotConnectedError = 'redis client doesn\'t exist or isn\'t connected';
// const EXPIRATION_SECONDS = 2 * 60 * 60; // One hour?

class RedisCacheHelper {
  public client: redis.RedisClient;
  public getAsync: (key: string) => Promise<any>;
  constructor() {
    if (!config.redis) {
      return;
    }
    const password = config.redis.redisPassword ? `password=${encodeURIComponent(config.redis.redisPassword)}` : '';
    this.client = redis.createClient({
      url: `redis://${config.redis.redisHost}:${config.redis.redisPort}/${config.redis.redisDb || 0}?${password}`
    });

    // this MUST be here or api will go down when redis goes down
    if (this.client) {
      this.client.on('error', (err) => {
        console.error('Error connecting to redis'); // eslint-disable-line no-console
        console.log(err); // eslint-disable-line no-console
      });
      this.getAsync = promisify(this.client.get).bind(this.client);
    }
  }

  public storeInCache(key: string, value: string) {
    const redisClient = this.client;
    if (!redisClient || !redisClient.connected) {
      console.error(redisNotConnectedError); // eslint-disable-line no-console
      return;
    }
    try {
      redisClient.set(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Failed to set key in redis: ${err}`); // eslint-disable-line no-console
    }
  }

  public clearCacheForKeys(keys: string[]) {
    const redisClient = this.client;
    if (!redisClient || !redisClient.connected) {
      console.error(redisNotConnectedError); // eslint-disable-line no-console
      return;
    }
    if (keys === null) {
      console.error('Tried to clear cache of null key'); // eslint-disable-line no-console
      return;
    }
    try {
      this.client.del(keys);
    } catch (err) {
      console.error(`Failed to delete key from redis: ${err}`); // eslint-disable-line no-console
    }
  }

  public getFromCache(key: string) {
    const redisClient = this.client;
    if (!redisClient || !redisClient.connected) {
      console.error(redisNotConnectedError); // eslint-disable-line no-console
      return Promise.resolve(null);
    }

    return this.getAsync(key);
  }
}

export default RedisCacheHelper;
