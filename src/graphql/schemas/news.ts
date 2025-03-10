import { gql } from "graphql-tag";

export const newsTypeDefs = gql`
  type News {
    id: Int
    title: String
    description: String
    image: String
    category: String
    timestamp: String
  }

  type NewsResponse implements Response {
    status: Int
    message: String
    error: String
    data: [News]
  }

  extend type Query {
    getAllNews: NewsResponse
  }
`;
