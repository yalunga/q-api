import { gql } from 'apollo-server-express';

export const viewCountsTypeDefs = gql`
  type ViewCount {
      streamId: String!
      twitchId: String!
      timestamp: String!
      game: String!
      title: String!
      count: Int!
  }

  type ViewCountAverage {
    date: String!
    avg: Float!
  }

  type ViewCountsByDayOfTheWeek {
    day: String!
    count: Float!
  }

  type ViewCountsByHourOfTheDay {
    houroftheday: Int!
    count: Float!
  }

  type ViewCountsByGame {
    game: String!
    count: Float!
  }
`;
