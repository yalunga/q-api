import * as express from 'express';
import * as moment from 'moment';

import { Stream } from '../../../entity/Streams';
import { Game } from '../../../entity/Game';
import { getNameFromGameId, getTwitchStream, getTwitchAccountFromId } from '../../../utils/TwitchClient';
import { User } from '../../../entity/Users';
import { ViewCount } from '../../../entity/ViewCounts';

const router = express.Router();

const intervals: any = {};

const startTrackingStream = async (streamId: string, twitchId: string, gameId: string, startedAt: string, title: string): Promise<void> => {
    const user = await User.findOne({ where: { twitchId } });
    if (!user) return;
    const twitchUser = await getTwitchAccountFromId(twitchId);
    await Stream.create({
        streamId,
        twitchId,
        startedAt: moment(startedAt).utc().toDate(),
        viewsAtBeginning: twitchUser.view_count
    }).save();
    const gameName = await getNameFromGameId(gameId, user.accessToken);
    const time = moment.utc().toDate();
    // Check to see if its a change in title or game and put an end to tracking that part of the stream
    const previousGame = await Game.findOne({ where: { streamId, endedAt: null } });
    if (previousGame) {
        previousGame.endedAt = time;
        await previousGame.save();
    }
    // Save a new game
    const game = Game.create({
        twitchId,
        streamId,
        game: gameName,
        title,
        startedAt: time
    });
    await game.save();
    intervals[twitchId] = setInterval(async () => {
        const stream = await getTwitchStream(twitchId, user.accessToken);
        if (stream) {
            await ViewCount.create({
                streamId,
                twitchId,
                game: await getNameFromGameId(stream.game_id, user.accessToken),
                title,
                count: stream.viewer_count,
                timestamp: moment().utc().toDate()
            }).save();
        }
        // tslint:disable-next-line: align
    }, 60000 * 5);
};

router.get('/:twitchId/stream', async (req, res) => {
    res.send(req.query['hub.challenge']);
    const { twitchId } = req.params;
    console.log('here', twitchId);
    const user = await User.findOne({ where: { twitchId } });
    if (user) {
        const stream = await getTwitchStream(twitchId, user.accessToken);
        if (stream.type === 'live') {
            console.log('Stream is live', stream);
            await startTrackingStream(stream.id, stream.user_id, stream.game_id, stream.started_at, stream.title);
        }
    }
});

router.post('/:twitchId/stream', async (req, res) => {
    // Acknowledge that we recieved the payload
    res.send();
    const { data } = req.body;
    if (intervals[req.params.twitchId]) {
        clearInterval(intervals[req.params.twitchId]);
    }
    if (data.length > 0) {
        const { id, user_id, game_id, title, started_at } = data[0];
        await startTrackingStream(id, user_id, game_id, started_at, title);
    } else {
        const time = moment.utc().toDate();
        const stream = await Stream.findOne({ where: { endedAt: null, twitchId: req.params.twitchId } });
        if (stream) {
            const twitchUser = await getTwitchAccountFromId(req.params.twitchId);
            stream.endedAt = time;
            stream.viewsAtEnd = twitchUser.view_count;
            stream.totalViews = stream.viewsAtEnd - stream.viewsAtBeginning;
            await stream.save();
        }
        const game = await Game.findOne({ where: { endedAt: null, twitchId: req.params.twitchId } });
        if (game) {
            game.endedAt = time;
            await game.save();
        }
    }
});

export default router;
