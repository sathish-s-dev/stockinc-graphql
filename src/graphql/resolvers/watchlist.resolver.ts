import { ServerContext } from "../../server";
import { GraphQLError } from "graphql";

export const watchlistResolvers = {
  Query: {
    getAllWatchlists: async (
      _parent: any,
      args: any,
      { Watchlist }: ServerContext
    ) => {
      const watchlists = await Watchlist.find();
      console.log(watchlists);
      return watchlists;
    },
    getWatchlistStocks: async (
      _parent: any,
      args: { userId: string },
      { Watchlist }: ServerContext
    ) => {
      const watchlist1 = await Watchlist.aggregate([
        { $match: { userId: args.userId } },
        {
          $lookup: {
            from: "stocks",
            localField: "stockSymbols",
            foreignField: "symbol",
            as: "stocks",
          },
        },
      ]);

      const watchlist2 = await Watchlist.findOne({ userId: args.userId });

      console.log("watchlist ", watchlist1);
      return watchlist1;
    },
  },
  Mutation: {
    addStockToWatchlist: async (
      _parent: any,
      args: { userId: string; symbol: string },
      { Watchlist }: ServerContext
    ) => {
      const watchlist = await Watchlist.findOne({ userId: args.userId });

      if (!watchlist) {
        throw new Error("Watchlist not found");
      }
      const existingStockSymbol = watchlist.stockSymbols.includes(args.symbol);
      if (existingStockSymbol) {
        return {
          message: "stock already exists",
          status: 500,
          data: null,
          error: "stock is already available in watchlist",
        };
      }

      try {
        const updatedWatchlist = await Watchlist.updateOne(
          { userId: args.userId }, // Find the watchlist by userId
          { $push: { stockSymbols: args.symbol } } // Push a new stock symbol to the array
        );

        console.log(updatedWatchlist);

        return {
          message: "stock added to watchlist",
          status: 202,
          data: updatedWatchlist,
          error: null,
        };
      } catch (error) {
        return {
          message: "something went wrong",
          status: 500,
          data: null,
          error: "stock not added to watchlist",
        };
      }
    },
  },
};
