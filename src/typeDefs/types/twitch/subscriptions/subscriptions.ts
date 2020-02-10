import { gql } from 'apollo-server-express';

export const subscriptionTypeDefs = gql`
  type Subscription {
      fromId: String!
      fromName: String!
      toId: String!
      toName: String!
      followedAt: String!
      streamId: String
      game: String
  }
`;
