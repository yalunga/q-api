import * as express from 'express';

import { Follow } from '../../entity/Follows';
import twitchClient from '../../utils/TwitchClient';
import { User } from '../../entity/Users';

const router = express.Router();

router.get('/follow', (req, res) => {
    res.send(req.query['hub.challenge']);
});

router.get('/followed', (req, res) => {
    res.send(req.query['hub.challenge']);
});

router.post('/follow', async (req, res) => {
    const follow = req.body.data[0];
    const { from_id, from_name, to_id, to_name, followed_at } = follow;
    const user = await User.findOne({ where: { twitchId: to_id } });
    if (!user) return;
    const { data } = await twitchClient.get(`/streams?user_id=${to_id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });
    const stream = data.data.length > 0 ? data.data[0] : null;
    let game = null;
    if (stream) {
        const { data: gameData } = await twitchClient.get(`/games?id=${stream.game_id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });
        gameData.data.length > 0 ? game = gameData.data[0] : game = null;
    }
    await Follow.create({
        fromId: from_id,
        fromName: from_name,
        toId: to_id,
        toName: to_name,
        followedAt: followed_at,
        streamId: stream ? stream.id : null,
        game: game.name
    }).save();
    res.sendStatus(200);
});

router.post('/followed', async (req, res) => {
    const follow = req.body.data[0];
    const { from_id, from_name, to_id, to_name, followed_at } = follow;
    const user = await User.findOne({ where: { twitchId: from_id } });
    if (!user) return;
    await Follow.create({
        fromId: from_id,
        fromName: from_name,
        toId: to_id,
        toName: to_name,
        followedAt: followed_at
    }).save();
    res.sendStatus(200);
});

export default router;
