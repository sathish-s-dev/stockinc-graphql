"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
exports.userSchema = `
  #graphql

   type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
    ): User!
  }
`;
