import { gql } from 'apollo-server-express';

export const queryTypeDefs = gql`
  type Query {
    follows(since: String): [Follow]!
    following(since: String): [Follow]!
    followerCount: Int!
    followingCount: Int!
    streams(since: String): [Stream]!
    averageViewCount(since: String): Float!
    getViewCounts(since: String): [ViewCount]!
    subscribers(since: String): [Subscription]!
    subscriptions(since: String): [Subscription]!
    subscriberCount: Int!
  }
`;
