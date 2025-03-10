import { gql } from "graphql-tag";

export const commonTypeDefs = gql`
  interface Response {
    message: String
    status: Int
    error: String
  }
`;
