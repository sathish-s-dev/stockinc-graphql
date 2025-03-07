import { gql } from "graphql-tag";

export const typeDefs = gql(`#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  interface Response {
    message: String
    status: Int
    error: String
  }

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: Author
  }

  type Author {
    name: String
    book: [Book]
  }

  type Stock {
    id: String
    symbol: String
    company: String
    current_price: Float
    change: Float
    change_percent: Float
    market_cap: String
    volume: String
    pe_ratio: Float
    dividend_yield: Float
    logo: String
  }



  type StockResponse implements Response{
    status: Int
    message: String
    error: String
    data: [Stock]
  }

  type User{
    id: ID!
    name: String!
    email: String!
  }

  type UserResponse implements Response{
    status: Int
    message: String
    error: String
    data: [User]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  # case, the "books" query returns an array of zero or more Books (defined above).


type News {
    id: Int
    title: String
    description: String
    image: String
    category: String
    timestamp: String
}
type NewsResponse implements Response{
    status: Int
    message: String
    error: String
    data: [News]
  }

type Watchlist {
  id: ID
  userId: String
  stockSymbols: [String]
  stocks: [Stock] # Fetch full stock details
}

type WatchlistResponse implements Response{
    status: Int
    message: String
    error: String
    data: Watchlist
    
}




type Query {
    stocks(limit: Int = 10, offset: Int = 0): StockResponse
    allStocks: StockResponse
    stock(symbol: String!): StockResponse
    getAllUsers: UserResponse
    getAllNews: NewsResponse
    getWatchlistStocks(userId: String!): WatchlistResponse
}

type Mutation {
  createUser(name: String!, email: String!): UserResponse!
  createMultipleUsers(count: Int!): UserResponse
  addStockToWatchlist(userId: String!, symbol: String!): WatchlistResponse
}
`);
