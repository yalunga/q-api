import { gql } from 'apollo-server-express';

export const followsTypeDefs = gql`
  type Follow {
      fromId: String!
      fromName: String!
      toId: String!
      toName: String!
      followedAt: String!
      streamId: String
      game: String
  }

  type FollowCountGroupedByDate {
    date: String!
    count: Int!
  }

  type FollowCountByDayOfTheWeek {
    su: Int!
    m: Int!
    tu: Int!
    w: Int!
    th: Int!
    f: Int!
    sa: Int!
  }

  type FollowCountByHourOfTheDay {
    houroftheday: Int!
    count: Int!
  }

  type FollowCountByGame {
    game: String
    count: Int!
  }
`;
