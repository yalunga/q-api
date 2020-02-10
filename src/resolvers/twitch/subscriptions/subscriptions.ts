import { Subscription } from '../../../entity/Subscriptions';
import { getTotalSubscriptionsFromId } from '../../../utils/TwitchClient';

export const subscriptionsResolver = {
    Query: {
        subscribers: async (_: any, args: any, { user }: any) => {
            const { since } = args;
            return await Subscription.getSubscribers(user.twitchId, since);
        },
        subscriberCount: async (_: any, __: any, { user }: any) => {
            if (user) {
                return getTotalSubscriptionsFromId(user.twitchId, user.accessToken);
            }
            return Error('User not found');
        },
        subscriptions: async (_: any, { since }: any, { user }: any) => await Subscription.getSubscriptions(user.twitchId, since)
    }
};
