import { GraphQLError } from "graphql";
import { ServerContext } from "../../server";
import { Response } from "../../types";

export const stockResolvers = {
  Query: {
    stocks: async (
      _parent: any,
      args: { limit: number; offset: number },
      { Stock }: any
    ): Promise<Response> => {
      const paginattedStocks = await Stock.find()
        .skip(args.offset)
        .limit(args.limit);

      return paginattedStocks;
    },
    allStocks: async (_parent: any, args: any, { Stock }: ServerContext) => {
      const stocks = await Stock.find();
      console.log(stocks);
      return stocks;
    },
    stock: async (
      _parent: any,
      args: { symbol: string },
      { Stock }: ServerContext
    ) => {
      console.log("✅ Resolver is called with args:", args);

      const stock = await Stock.findOne({ symbol: args.symbol });
      console.log("Fetched stock from DB:", stock);
      console.log(stock);
      if (!stock?._id) {
        console.log("Stock not found:", args.symbol);
        throw new GraphQLError("stock not found", {
          extensions: { code: "NOT_FOUND", statusCode: 404 },
          path: ["stock"],
        });
      }
      return stock;
    },
  },
  Mutation: {
    // mutation resolvers
  },
};
