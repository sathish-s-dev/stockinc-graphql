import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type Watchlist {
    id: ID
    userId: String
    stockSymbols: [String]
    stocks: [Stock] # Fetch full stock details
  }

  type User {
    id: ID!
    name: String!
    email: String!
    watchlistId: String!
    watchlist: Watchlist
  }

  extend type Query {
    getAllUsers: [User]!
    getUserByEmail(email: String!): User
  }

  extend type Mutation {
    createUser(name: String!, email: String!): User!
    createMultipleUsers(count: Int!): [User]!
  }
`;
