import { Router, Request, Response } from 'express';
import * as moment from 'moment';

import { Stream } from '../../../entity/Streams';
import { Game } from '../../../entity/Game';
import { getGameFromId, getTwitchStream, getTwitchAccountFromId, getTotalTwitchFollowers } from '../../../utils/TwitchClient';
import { User } from '../../../entity/Users';
import { ViewCount } from '../../../entity/ViewCounts';
import { Follow } from '../../../entity/Follows';

const router = Router();

const intervals: any = {};

const viewerAndFollowCountTracker = async (twitchId: string) => {
  const stream = await getTwitchStream(twitchId);
  if (stream) {
    const game = await getGameFromId(stream.game_id);
    await ViewCount.create({
      streamId: stream.id,
      twitchId,
      game: game.name,
      title: stream.title,
      count: stream.viewer_count,
      timestamp: moment().utc().toDate()
    }).save();
    const followCount = await getTotalTwitchFollowers(twitchId);
    if (followCount) {
      await Follow.create({
        twitchId,
        streamId: stream.id,
        count: followCount,
        timestamp: moment().utc().toDate(),
        game: game.name
      }).save();
    }
  } else {
    clearInterval(intervals[twitchId]);
    const streamDB = await Stream.findOne({ where: { endedAt: null, twitchId } });
    const time = moment().utc().toDate();
    if (streamDB) {
      const twitchUser = await getTwitchAccountFromId(twitchId);
      streamDB.endedAt = time;
      streamDB.viewsAtEnd = twitchUser.view_count;
      await streamDB.save();
    }
    const game = await Game.findOne({ where: { endedAt: null, twitchId } });
    if (game) {
      game.endedAt = time;
      await game.save();
    }
  }
};

const startTrackingStream = async (streamId: string, twitchId: string, gameId: string, startedAt: string, title: string): Promise<void> => {
  const user = await User.findOne({ where: { twitchId } });
  console.log('Twitch Stream is live: ', user ? user.twitchName : '');
  if (!user) return;
  const twitchUser = await getTwitchAccountFromId(twitchId);
  const followCount = await getTotalTwitchFollowers(twitchId);
  const previousStream = await Stream.findOne({ where: { streamId } });
  if (!previousStream) {
    await Stream.create({
      streamId,
      twitchId,
      title,
      startedAt: moment(startedAt).utc().toDate(),
      viewsAtBeginning: twitchUser.view_count
    }).save();
  }
  const game = await getGameFromId(gameId);
  const time = moment.utc().toDate();
  // Check to see if its a change in title or game and put an end to tracking that part of the stream
  const previousGame = await Game.findOne({ where: { streamId, endedAt: null } });
  if (previousGame) {
    previousGame.endedAt = time;
    await previousGame.save();
  }
  // Save a new game
  await Game.create({
    twitchId,
    streamId,
    game: game.name,
    image: game.box_art_url,
    title,
    startedAt: time
  }).save();
  // Save Follow Count At Beginning of Stream
  await Follow.create({
    twitchId,
    streamId,
    count: followCount,
    timestamp: time,
    game: game.name
  }).save();

  intervals[twitchId] = setInterval(() => viewerAndFollowCountTracker(twitchId), 60000 * 30);
};

const acceptChallenge = async (req: Request, res: Response) => {
  res.send(req.query['hub.challenge']);
  const { twitchId } = req.params;
  const stream = await getTwitchStream(twitchId);
  if (stream.type === 'live') {
    await startTrackingStream(stream.id, stream.user_id, stream.game_id, stream.started_at, stream.title);
  }
};

const newStream = async (req: Request, res: Response) => {
  // Acknowledge that we recieved the payload
  res.sendStatus(200);
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
      await stream.save();
    }
    const game = await Game.findOne({ where: { endedAt: null, twitchId: req.params.twitchId } });
    if (game) {
      game.endedAt = time;
      await game.save();
    }
  }
};

const getStreamByTwitchId = async (req: Request, res: Response) => {
  const { twitchId } = req.params;
  const streams = await Stream.find({ twitchId });
  res.json(streams ? streams : []);
};

const getGameFromStreamId = async (req: Request, res: Response) => {
  const { streamId } = req.params;
  const games = await Game.find({ streamId });
  res.json(games ? games : []);
};

router.get('/streams/:twitchId', acceptChallenge);
router.get('/streams/:twitchId/get', getStreamByTwitchId);
router.get('/streams/:streamId/games', getGameFromStreamId);
router.post('/streams/:twitchId', newStream);

export default router;
