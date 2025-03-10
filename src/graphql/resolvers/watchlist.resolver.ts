import { ServerContext } from "../../server";

export const watchlistResolvers = {
  Query: {
    getAllWatchlists: async (
      _parent: any,
      args: any,
      { Watchlist }: ServerContext
    ) => {
      const watchlists = await Watchlist.find();
      console.log(watchlists);
      return {
        data: watchlists,
        message: "watchlists fetched successfully",
        status: 200,
        error: null,
      };
    },
    getWatchlistStocks: async (
      _parent: any,
      args: { userId: string },
      { Watchlist, Stock }: ServerContext
    ) => {
      // 1️⃣ Get the watchlist for the given user
      const dbWatchlist = await Watchlist.find({ userId: args.userId });

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

      if (!dbWatchlist) {
        throw new Error("Watchlist not found");
      }

      const stocks = await Stock.find({ symbol: dbWatchlist[0].stockSymbols });

      const watchlist = {
        userId: dbWatchlist[0].userId,
        id: dbWatchlist[0]._id,
        stocks,
        stockSymbols: dbWatchlist[0].stockSymbols,
      };
      console.log(stocks);
      return {
        message: "watchlist fetched successfully",
        status: 200,
        error: null,
        data: watchlist1,
      };
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
