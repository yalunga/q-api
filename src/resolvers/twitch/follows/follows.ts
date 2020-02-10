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
        following: async (_: any, { since }: any, { user }: any) => await Follow.getFollowing(user.twitchId, since)
    }
};
