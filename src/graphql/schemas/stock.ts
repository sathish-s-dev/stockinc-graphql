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

  extend type Query {
    stocks(limit: Int = 10, offset: Int = 0): [Stock]
    allStocks: [Stock]
    stock(symbol: String!): Stock
  }
`;
