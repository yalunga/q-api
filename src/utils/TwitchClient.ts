import * as axios from 'axios';
import * as jwt from 'jsonwebtoken';
// tslint:disable-next-line
require('dotenv').config();

import { User } from '../entity/Users';

const twitchClient = axios.default.create({
    baseURL: 'https://api.twitch.tv/helix',
    headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID
    }
});

export default twitchClient;

export const oAuthRedirect = async (_: any, res: any): Promise<void> => {
    res.redirect(`https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=http://localhost:4000/auth/twitch/callback&response_type=code&scope=channel:read:subscriptions`);
};

const enableWebhooks = async (twitchId: string): Promise<void> => {
    try {
        const result = await twitchClient.post(`https://api.twitch.tv/helix/webhooks/hub`, {
            'hub.callback': `${process.env.BASE_URL}/api/twitch/follow`,
            'hub.mode': 'subscribe',
            'hub.topic': `https://api.twitch.tv/helix/users/follows?first=1&to_id=${twitchId}`,
            'hub.lease_seconds': 864000
        });
        console.log(result.data);
    } catch (error) {
        console.log(error);
    }

    try {
        const result = await twitchClient.post(`https://api.twitch.tv/helix/webhooks/hub`, {
            'hub.callback': `${process.env.BASE_URL}/api/twitch/followed`,
            'hub.mode': 'subscribe',
            'hub.topic': `https://api.twitch.tv/helix/users/follows?first=1&from_id=${twitchId}`,
            'hub.lease_seconds': 864000
        });
        console.log(result.data);
    } catch (error) {
        console.log(error);
    }

    try {
        const result = await twitchClient.post(`https://api.twitch.tv/helix/webhooks/hub`, {
            'hub.callback': `${process.env.BASE_URL}/api/twitch/following`,
            'hub.mode': 'subscribe',
            'hub.topic': `https://api.twitch.tv/helix/users/follows?first=1&from_id=${twitchId}`,
            'hub.lease_seconds': 864000
        });
        console.log(result.data);
    } catch (error) {
        console.log(error);
    }

    try {
        const result = await twitchClient.post(`https://api.twitch.tv/helix/webhooks/hub`, {
            'hub.callback': `${process.env.BASE_URL}/api/twitch/${twitchId}/stream`,
            'hub.mode': 'subscribe',
            'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${twitchId}`,
            'hub.lease_seconds': 864000
        });
        console.log(result.data);
    } catch (error) {
        console.log(error);
    }
};

export const exchangeCodeForTokenAndSaveUser = async (req: any, res: any): Promise<void> => {
    const result = await axios.default.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=http://localhost:3000`);
    const { access_token: accessToken, refresh_token: refreshToken } = result.data;
    const { data: twitchData } = await twitchClient.get('/users', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const { id, display_name, profile_image_url } = twitchData.data[0];
    console.log(id);
    const user = await User.create({
        twitchId: id,
        twitchName: display_name,
        accessToken,
        refreshToken,
        twitchProfileImage: profile_image_url
    })
    await user.save();
    await enableWebhooks(id);
    setInterval(() => enableWebhooks(id), 864000 * 1000);
    const token = jwt.sign(user.id, process.env.TOKEN_SECRET as string);
    res.cookie('token', token, { httpOnly: true, expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365 * 10)) });
    res.redirect(`http://localhost:3000/`);
};

export const getTwitchFollows = async (twitchId: string): Promise<any> => {
    let followers = [];
    try {
        const { data } = await twitchClient.get(`/users/follows?to_id=${twitchId}&first=100`);
        console.log(data);
        followers = data.data;
        return followers;
    } catch (error) {
        console.log(error);
    }
};

export const getTwitchIdFromUsername = async (username: string): Promise<string> => {
    const { data } = await twitchClient.get(`/users?login=${username}`);
    console.log(data);
    return data;
};

export const getTwitchAccountFromId = async (id: string): Promise<any> => {
    const { data } = await twitchClient.get(`/users?id=${id}`);
    return data;
};

export const getNameFromGameId = async (gameId: string, accessToken: string): Promise<string> => {
    const { data: gameData } = await twitchClient.get(`/games?id=${gameId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    const gameMetadata = gameData.data[0];
    return gameMetadata.name;
};

export const getTwitchStream = async (twitchId: string, accessToken: string): Promise<any> => {
    const { data } = await twitchClient.get(`/streams?user_id=${twitchId}&first=1`, { headers: { Authorization: `Bearer ${accessToken}` } });
    const stream = data.data[0];
    return stream;
};

export const getTotalTwitchFollowers = async (twitchId: string, accessToken: string): Promise<number> => {
    const { data: { total: totalFollowers } } = await twitchClient.get(
        `/users/follows?to_id=${twitchId}&first=1`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return totalFollowers ? totalFollowers : 0;
};

export const getTotalTwitchFollowing = async (twitchId: string, accessToken: string): Promise<number> => {
    const { data: { total: totalFollowing } } = await twitchClient.get(
        `/users/follows?from_id=${twitchId}&first=1`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );
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
