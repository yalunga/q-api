import * as axios from 'axios';
import config from '../config';
import { init } from './Init';
import { wait } from './TimerUtils';
import { User } from '../entity/Users';
import Cache from './Cache';

const twitchClient = axios.default.create({
  baseURL: 'https://api.twitch.tv/helix',
  headers: {
    'Client-ID': config.twitchClientId
  }
});

const cache = new Cache();

class TwitchApi {
  public async setTokens(accessToken: string, refreshToken: string) {
    await cache.set('tokens', { accessToken, refreshToken });
  }

  public async getTokens() {
    return await cache.get('tokens');
  }
  public async get(endpoint: string): Promise<any> {
    try {
      const { accessToken } = await this.getTokens();
      const result = await twitchClient.get(
        endpoint,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return result;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log(endpoint, 'WAITING');
        await wait(60000);
        return await this.get(endpoint);
      }
      if (error.response && error.response.status === 401) {
        const { refreshToken } = await this.getTokens();
        const result = await axios.default.post(`https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${config.twitchClientId}&client_secret=${config.twitchClientSecret}`);
        const { access_token, refresh_token } = result.data;
        this.setTokens(access_token, refresh_token);
        return await this.get(endpoint);
      }
      throw error;
    }

  }

  public async post(endpoint: string, data: object): Promise<any> {
    try {
      const { accessToken } = await this.getTokens();
      const result = await twitchClient.post(
        endpoint,
        data,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return result;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log(endpoint, 'WAITING');
        await wait(60000);
        return await this.post(endpoint, data);
      }
      if (error.response && error.response.status === 401) {
        const { refreshToken } = await this.getTokens();
        const result = await axios.default.post(`https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${config.twitchClientId}&client_secret=${config.twitchClientSecret}`);
        const { access_token, refresh_token } = result.data;
        this.setTokens(access_token, refresh_token);
        return await this.post(endpoint, data);
      }
      throw error;
    }
  }
}

const twitchApi = new TwitchApi();

export const oAuthRedirect = async (_: any, res: any): Promise<void> => {
  res.redirect(`https://id.twitch.tv/oauth2/authorize?client_id=${config.twitchClientId}&redirect_uri=http://localhost:4000/auth/twitch/callback&response_type=code&scope=channel:read:subscriptions`);
};

export const enableWebhooks = async (twitchId: string, twitchName: string): Promise<void> => {
  try {
    const result = await twitchApi.post(`https://api.twitch.tv/helix/webhooks/hub`, {
      'hub.callback': `${config.baseUrl}/api/twitch/streams/${twitchId}`,
      'hub.mode': 'subscribe',
      'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${twitchId}`,
      'hub.lease_seconds': 864000
    });
    console.log(`Streams webhook for ${twitchName}: ${result.status}`);
  } catch (error) {
    console.log(error);
  }
  console.log('Done Enabling webhooks for: ', twitchName);
};

export const exchangeCodeForTokenAndSaveUser = async (req: any, res: any): Promise<void> => {
  const result = await axios.default.post(`https://id.twitch.tv/oauth2/token?client_id=${config.twitchClientId}&client_secret=${config.twitchClientSecret}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=http://localhost:3000`);
  const { access_token: accessToken, refresh_token: refreshToken } = result.data;
  twitchApi.setTokens(accessToken, refreshToken);
  await init();
  setInterval(() => init(), 3600000);
  res.redirect(`http://localhost:3000/`);
};

export const getTwitchFollows = async (twitchId: string): Promise<any> => {
  let followers = [];
  try {
    const { data } = await twitchApi.get(`/users/follows?to_id=${twitchId}&first=100`);
    console.log(data);
    followers = data.data;
    return followers;
  } catch (error) {
    console.log(error);
  }
};

export const getTwitchIdFromUsername = async (username: string): Promise<string> => {
  const { data } = await twitchApi.get(`/users?login=${username}`);
  console.log(data);
  return data;
};

export const getTwitchAccountFromId = async (id: string): Promise<any> => {
  const { data: { data } } = await twitchApi.get(`/users?id=${id}`);
  return data[0];
};

export const getGameFromId = async (gameId: string): Promise<{ id: string; name: string; box_art_url: string; }> => {
  const { data: gameData } = await twitchApi.get(`/games?id=${gameId}`);
  const gameMetadata = gameData.data[0];
  return gameMetadata;
};

export const getTwitchStream = async (twitchId: string): Promise<any> => {
  const { data } = await twitchApi.get(`/streams?user_id=${twitchId}&first=1`);
  const stream = data.data[0];
  return stream;
};

export const getTotalTwitchFollowers = async (twitchId: string): Promise<number> => {
  const { data: { total: totalFollowers } } = await twitchApi.get(`/users/follows?to_id=${twitchId}&first=1`);
  return totalFollowers ? totalFollowers : 0;
};

export const getTotalTwitchFollowing = async (twitchId: string): Promise<number> => {
  const { data: { total: totalFollowing } } = await twitchApi.get(`/users/follows?from_id=${twitchId}&first=1`);
  return totalFollowing ? totalFollowing : 0;
};

export const getTotalSubscriptionsFromId = async (twitchId: string, accessToken: string): Promise<number> => {
  try {
    const { data } = await twitchClient.get(
      `/subscriptions?broadcaster_id=${twitchId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getAllStreamsHelper = async (allStreams: any[], cursor: string): Promise<any> => {
  try {
    const { data } = await twitchApi.get(`streams?after=${cursor}`);
    const streams = data.data;

    for (const stream of streams) {
      console.log(stream.viewer_count);
      const doesUserExist = await User.findOne({ twitchId: stream.user_id });
      if (doesUserExist) {
        continue;
      } else if (allStreams.length >= 100) {
        return allStreams;
      } else if (stream.viewer_count >= 10) {
        allStreams.push(stream);
      } else {
        return allStreams;
      }
    }

    if (data.pagination.cursor) {
      return await getAllStreamsHelper(allStreams, data.pagination.cursor);
    }

    return allStreams;
  } catch (error) {
    console.log(error);
  }
};

export const getAllCurrentStreams = async (): Promise<any> => {
  let allStreams = [];
  try {
    const { data } = await twitchApi.get('/streams');
    const streams = data.data;
    for (const stream of streams) {
      if (stream.viewer_count >= 10) {
        allStreams.push(stream);
      }
    }
    allStreams = await getAllStreamsHelper(allStreams, data.pagination.cursor);
    console.log('Done...total streams with over 25 viewers: ', allStreams.length);
    return allStreams;
  } catch (error) {
    console.log(error);
  }
};

export default twitchApi;
