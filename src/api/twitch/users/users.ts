import { Router, Request, Response } from 'express';
import { getTwitchAccountFromId } from '../../../utils/TwitchClient';
import { User } from '../../../entity/Users';

const router = Router();

const getUserByTwitchId = async (req: Request, res: Response) => {
  const { twitchId } = req.params;
  const twitchUser = await getTwitchAccountFromId(twitchId);
  if (twitchUser) {
    res.status(200).json(twitchUser);
  } else {
    res.status(404);
  }
};

const getUserBySearch = async (req: Request, res: Response) => {
  const { search } = req.query;
  const users = await User.getUsersByName(search);
  res.json(users);
};

router.get('/users', getUserBySearch);
router.get('/users/:twitchId', getUserByTwitchId);

export default router;
