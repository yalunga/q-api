import { gql } from 'apollo-server-express';

export const viewCountsTypeDefs = gql`
  type ViewCount {
      streamId: String!
      twitchId: String!
      timestamp: String!
      game: String!
      title: String!
      viewCount: Int!
  }
`;
