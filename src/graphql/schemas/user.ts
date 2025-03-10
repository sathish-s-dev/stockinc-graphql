
import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
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
