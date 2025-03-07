import data from "../../../db.json";
import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import { ServerContext } from "../../server";
import { GraphQLResponse } from "../../utils/GraphqlResponse";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { User } from "../../db/schemas/User.schema";
import { Watchlist } from "../../db/schemas/Watchlist.schema";
import { Stock } from "../../db/schemas/Stock.schema";
import { Stock as TStock } from "@prisma/client";
import { error } from "console";

export const watchlistResolvers = {
  Query: {
    getWatchlistStocks: async (
      _parent: any,
      args: { userId: string },
      { prisma }: ServerContext
    ) => {
      // 1️⃣ Get the watchlist for the given user
      const dbWatchlist = await Watchlist.find({ userId: args.userId });

      console.log("watchlist ", dbWatchlist);

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
        data: watchlist,
      };
    },
  },
  Mutation: {
    addStockToWatchlist: async (
      _parent: any,
      args: { userId: string; symbol: string },
      { prisma }: ServerContext
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

type Response = {
  message: string;
  status: number;
  data: any;
  error: string | null;
};

export const resolvers = {
  Query: {
    stocks: async (
      _parent: any,
      args: { limit: number; offset: number },
      { prisma }: any
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
      { prisma }: ServerContext
    ) => {
      console.log("✅ Resolver is called with args:", args);

      try {
        const stock = await Stock.findOne({ symbol: args.symbol });
        console.log("📌 Fetched stock from DB:", stock);
        console.log(stock);
        if (!stock?._id) {
          console.log("❌ Stock not found:", args.symbol);
          throw new Error("stock not found");
        }
        return {
          message: "stock fetched successfully",
          status: 200,
          data: stock,
          error: "stock not found",
        };
      } catch (error) {
        console.error("🔥 Error fetching stock:", error);
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
    // news resolvers
    getAllNews: async (
      _parent: any,
      args: any,
      { News }: ServerContext
    ): Promise<Response> => {
      const news = await News.find();

      return {
        data: news,
        message: "news fetched successfuly",
        status: 200,
        error: null,
      };
    },
    // user resolvers
    getAllUsers: async (_parent: any, args: any, { prisma }: ServerContext) => {
      try {
        const users = await User.find();
        return {
          data: users,
          message: "users fetched successfuly",
          status: 200,
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          message: "something went wrong",
          status: 500,
          error: "something went wrong on our server",
        };
      }
    },
    ...watchlistResolvers.Query,
  },

  Mutation: {
    createUser: async (
      _parent: any,
      args: { name: string; email: string },
      { User }: ServerContext
    ) => {
      try {
        const id = v4();

        // Check if user already exists
        const existingUser = await User.findOne({ email: args.email });
        if (existingUser && existingUser?.name) {
          return {
            message: "user with exists",
            status: 400,
            data: null,
            error: `user with ${args.email} already exists`,
          };
        }

        // Create user
        const user = await User.insertOne({
          name: args.name,
          email: args.email,
          watchlistId: id,
        });

        if (!user.id) {
          throw new Error("User creation failed");
        }

        // Create associated watchlist
        const watchlist = await Watchlist.insertOne({
          _id: id,
          userId: user._id,
          stocks: [],
          stockSymbols: ["AAPL"],
        });

        console.log(watchlist);

        return {
          message: "user created sucessfully",
          status: 201,
          data: [user],
          error: null,
        };
      } catch (error) {
        return {
          message: "something went wrong",
          status: 500,
          data: null,
          error: "Internal Server Error",
        };
      }
    },
    createMultipleUsers: async (
      _parent: any,
      args: { count: number },
      { User }: ServerContext
    ) => {
      try {
        const users = [];
        console.log(args.count);

        for (let i = 0; i < args.count; i++) {
          const userObj = {
            name: `user-${i}`,
            email: `ssathish-${i}@gmail.com`,
            watchlistId: v4(),
          };
          users.push(userObj);
          console.log("User added:", userObj); // Debugging
        }

        console.log(users);

        const pushedUsers = await User.insertMany(users);

        console.log(pushedUsers);
        console.log("✅ Successfully inserted users:", pushedUsers.length);
        console.log("📌 First user inserted:", pushedUsers[0]);

        return {
          message: "users pushed successfully",
          data: pushedUsers,
          error: null,
          status: 200,
        };
      } catch (error) {
        return {
          message: "failed to insert",
          status: 400,
        };
      }
    },
    ...watchlistResolvers.Mutation,
  },
};
