import { ViewCount } from '../../../entity/ViewCounts';

export const viewCountsResolver = {
    Query: {
        averageViewCount: async (_: any, args: any, { user }: any) => await ViewCount.getAverageViewCount(user.twitchId, args.since),
        getViewCounts: async (_: any, args: any, { user }: any) => await ViewCount.getViewCounts(user.twitchId, args.since)
    }
};
