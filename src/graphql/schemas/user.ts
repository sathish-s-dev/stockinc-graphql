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
    watchlistId: String
    watchlist: Watchlist
  }

  type UserResponse implements Response {
    status: Int
    message: String
    error: String
    data: [User]
  }

  extend type Query {
    getAllUsers: UserResponse
  }

  extend type Mutation {
    createUser(name: String!, email: String!): UserResponse!
    createMultipleUsers(count: Int!): UserResponse
  }
`;
