import { Router, Request, Response } from 'express';
import { Follow } from '../../../entity/Follows';

const router = Router();

const getFollowsByTwitchId = async (req: Request, res: Response) => {
  const { twitchId } = req.params;
  const follows = await Follow.find({ twitchId });
  res.status(200).json(follows);
};

router.get('/follow/:twitchId', getFollowsByTwitchId);

export default router;
