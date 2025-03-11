

import { gql } from "graphql-tag";
import { userTypeDefs } from "./user";
import { stockTypeDefs } from "./stock";
import { newsTypeDefs } from "./news";
import { watchlistTypeDefs } from "./watchlist";

export const typeDefs = gql`
  ${userTypeDefs}
  ${stockTypeDefs}
  ${newsTypeDefs}
  ${watchlistTypeDefs}
  
  type Query
  type Mutation
`;
