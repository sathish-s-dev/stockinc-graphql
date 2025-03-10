import { gql } from "graphql-tag";

export const stockTypeDefs = gql`
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

  type StockResponse implements Response {
    status: Int
    message: String
    error: String
    data: [Stock]
  }

  extend type Query {
    stocks(limit: Int = 10, offset: Int = 0): StockResponse
    allStocks: StockResponse
    stock(symbol: String!): StockResponse
  }
`;
