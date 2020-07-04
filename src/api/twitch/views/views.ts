import { Router, Request, Response } from 'express';
import { ViewCount } from '../../../entity/ViewCounts';

const router = Router();

const getViewsByTwitchId = async (req: Request, res: Response) => {
  const { twitchId } = req.params;
  const views = await ViewCount.find({ twitchId });
  res.json(views);
};

router.get('/views/:twitchId', getViewsByTwitchId);

export default router;
