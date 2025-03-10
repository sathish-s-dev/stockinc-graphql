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

      return {
        data: paginattedStocks,
        status: 200,
        error: null,
        message: "stocks fetched successfully",
      };
    },
    allStocks: async (_parent: any, args: any, { Stock }: ServerContext) => {
      try {
        const stocks = await Stock.find();
        console.log(stocks);
        return {
          message: "stock fetched successfully",
          status: 200,
          data: stocks,
          error: null,
        };
      } catch (error) {
        return {
          message: "stock not found",
          status: 404,
          data: null,
          error: "stock not found",
        };
      }
    },
    stock: async (
      _parent: any,
      args: { symbol: string },
      { Stock }: ServerContext
    ) => {
      console.log("✅ Resolver is called with args:", args);

      try {
        const stock = await Stock.findOne({ symbol: args.symbol });
        console.log("Fetched stock from DB:", stock);
        console.log(stock);
        if (!stock?._id) {
          console.log("Stock not found:", args.symbol);
          throw new Error("stock not found");
        }
        return {
          message: "stock fetched successfully",
          status: 200,
          data: stock,
          error: "stock not found",
        };
      } catch (error) {
        console.error("Error fetching stock:", error);
        if (error instanceof Error) {
          return {
            message: "stock not found",
            status: 404,
            data: null,
            error: `stock not found with ${args.symbol} not found`,
          };
        }
      }
    },
  },
  Mutation: {
    // mutation resolvers
  },
};
