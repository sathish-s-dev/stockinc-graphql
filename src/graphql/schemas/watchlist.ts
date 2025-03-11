import { gql } from "graphql-tag";

export const watchlistTypeDefs = gql`
  type Watchlist {
    id: ID
    userId: String
    stockSymbols: [String]
    stocks: [Stock]
  }

  extend type Query {
    getWatchlistStocks(userId: String!): Watchlist
    getAllWatchlists: [Watchlist]
  }

  extend type Mutation {
    addStockToWatchlist(userId: String!, symbol: String!): Watchlist
  }
`;
