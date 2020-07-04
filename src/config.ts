import * as config from 'config';

interface IConfig {
  baseUrl: string;
  twitchClientId: string;
  twitchClientSecret: string;
  redis: {
    redisPassword: string;
    redisDb: number;
    redisHost: string;
    redisPort: number;
  };
}

export default config as config.IConfig & IConfig;
