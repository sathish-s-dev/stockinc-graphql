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

  extend type Query {
    getAllNews: [News]
  }
`;
