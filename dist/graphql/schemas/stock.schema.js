"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockSchema = void 0;
exports.stockSchema = `
  #graphql

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

  type Query {
    stocks: [Stock!]
  }

  type Mutation {
    addStock(
      symbol: String!
      company: String!
      current_price: Float!
      change: Float!
      change_percent: Float!
      market_cap: String!
      volume: String!
      pe_ratio: Float!
      dividend_yield: Float!
      logo: String!
    ): Stock!
  }
`;
