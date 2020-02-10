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
`;
