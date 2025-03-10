import { gql } from "graphql-tag";

export const watchlistTypeDefs = gql`
  type Watchlist {
    id: ID
    userId: String
    stockSymbols: [String]
    stocks: [Stock] # Fetch full stock details
  }

  type WatchlistResponse implements Response {
    status: Int
    message: String
    error: String
    data: [Watchlist]
  }

  extend type Query {
    getWatchlistStocks(userId: String!): WatchlistResponse
    getAllWatchlists: WatchlistResponse
  }

  extend type Mutation {
    addStockToWatchlist(userId: String!, symbol: String!): WatchlistResponse
  }
`;
