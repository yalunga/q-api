import { gql } from 'apollo-server-express';

export const queryTypeDefs = gql`
  type Query {
    follows(since: String): [Follow]!
    following(since: String): [Follow]!
    followerCount: Int!
    followingCount: Int!
    followCountByDate(measureOfTime: String!, since: String): [FollowCountGroupedByDate]!
    followCountsByDayOfTheWeek: FollowCountByDayOfTheWeek!
    followCountsByHourOfTheDay: [FollowCountByHourOfTheDay]!
    followCountsByGame: [FollowCountByGame]!
    mostRecentFollows: [Follow]!

    streams(since: String): [Stream]!
    averageViewCount(since: String): Float!
    getViewCounts(since: String): [ViewCount]!
    viewCountByDate(measureOfTime: String!, since: String): [ViewCountAverage]!
    viewCountByDayOfTheWeek: [ViewCountsByDayOfTheWeek]!
    viewCountByHourOfTheDay: [ViewCountsByHourOfTheDay]!
    viewCountByGame: [ViewCountsByGame]!

    subscribers(since: String): [Subscription]!
    subscriptions(since: String): [Subscription]!
    subscriberCount: Int!
  }
`;
