import { Stream } from '../../../entity/Streams';

export const streamResolver = {
    Query: {
        streams: async (_: any, args: { since: Date }, { user }: any) => {
            const { since } = args;
            if (since) {
                return await Stream.getStreamsSinceDate(user.twitchId, since);
            }
            return await Stream.getAllStreams(user.twitchId);
        }
    }
};
