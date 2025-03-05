import { gql } from "graphql-tag";

export const typeDefs = gql(`#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

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
    id: Int
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

  type User{
    id: ID!
    name: String!
    email: String!
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

type Watchlist {
  id: ID!
  userId: Int!
  stockSymbols: [String!]!
  stocks: [Stock!]! # Fetch full stock details
}


type Query {
    books: [Book!]!
    stocks(limit: Int = 10, offset: Int = 0): [Stock!]
    allStocks: [Stock!]
    stock(symbol: String!): Stock
    getAllUsers: [User!]!
    getAllNews: [News!]!
    getWatchlistStocks(userId: Int!): Watchlist
    
}

type Mutation {
  createUser(name: String!, email: String!): User!
  addStockToWatchlist(userId: Int!, symbol: String!): String
}
`);
