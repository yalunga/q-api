import { ViewCount } from '../../../entity/ViewCounts';

export const viewCountsResolver = {
  Query: {
    averageViewCount: async (_: any, args: any, { user }: any) => await ViewCount.getAverageViewCount(user.twitchId, args.since),
    getViewCounts: async (_: any, args: any, { user }: any) => await ViewCount.getViewCounts(user.twitchId, args.since),
    viewCountByDate: async (_: any, { since, measureOfTime }: any, { user }: any) =>
      await ViewCount.getViewCountsByMeasureOfTime(user.twitchId, measureOfTime, since),
    viewCountByDayOfTheWeek: async (_: any, __: any, { user }: any) => await ViewCount.getViewCountsByDayOfTheWeek(user.twitchId),
    viewCountByHourOfTheDay: async (_: any, __: any, { user }: any) => await ViewCount.getViewCountsByHourOfTheDay(user.twitchId),
    viewCountByGame: async (_: any, __: any, { user }: any) => await ViewCount.getViewCountsByGame(user.twitchId)
  }
};
