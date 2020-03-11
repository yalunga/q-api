import { Follow } from '../../../entity/Follows';
import { getTotalTwitchFollowers, getTotalTwitchFollowing } from '../../../utils/TwitchClient';

export const followsResolver = {
    Query: {
        follows: async (_: any, args: any, { user }: any) => {
            const { since } = args;
            return await Follow.getFollows(user.twitchId, since);
        },
        followerCount: async (_: any, __: any, { user }: any) => {
            if (user) {
                return getTotalTwitchFollowers(user.twitchId, user.accessToken);
            }
            return Error('User not found');
        },
        followingCount: async (_: any, __: any, { user }: any) => {
            if (!user) return;
            return getTotalTwitchFollowing(user.twitchId, user.accessToken);
        },
        following: async (_: any, { since }: any, { user }: any) => await Follow.getFollowing(user.twitchId, since),
        followCountByDate: async (_: any, { measureOfTime, since }: any, { user }: any) =>
            await Follow.getFollowCountsByMeasureOfTime(user.twitchId, measureOfTime, since),
        followCountsByDayOfTheWeek: async (_: any, __: any, { user }: any) => await Follow.getFollowCountsByDayOfTheWeek(user.twitchId),
        followCountsByHourOfTheDay: async (_: any, __: any, { user }: any) => await Follow.getFollowCountsByHourOfTheDay(user.twitchId),
        followCountsByGame: async (_: any, __: any, { user }: any) => await Follow.getFollowCountsByGame(user.twitchId),
        mostRecentFollows: async (_: any, __: any, { user }: any) => Follow.getMostRecentFollows(user.twitchId)
    }
};
