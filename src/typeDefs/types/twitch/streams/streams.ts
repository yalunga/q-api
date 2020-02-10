import { gql } from 'apollo-server-express';

export const streamTypeDefs = gql`
  type Stream {
      streamId: String!
      twitchId: String!
      startedAt: String!
      endedAt: String
      viewsAtBeginning: Int!
      viewsAtEnd: Int
      totalViews: Int
  }
`;
