import data from "../../../db.json";
import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import { ServerContext } from "../../server";

export const watchlistResolvers = {
  Query: {
    getWatchlistStocks: async (
      _parent: any,
      args: { userId: string },
      { prisma }: ServerContext
    ) => {
      // 1️⃣ Get the watchlist for the given user
      const watchlist = await prisma.watchlist.findUnique({
        where: { userId: +args.userId },
      });

      console.log(watchlist);

      if (!watchlist) {
        throw new Error("Watchlist not found");
      }

      // 2️⃣ Fetch all stocks where symbol is in the watchlist's stockSymbols array
      const stocks = await prisma.stock.findMany({
        where: { symbol: { in: watchlist.stocks } },
      });

      console.log(stocks);

      // 3️⃣ Return the watchlist with the stocks included
      return {
        ...watchlist,
        stocks,
      };
    },
  },
  Mutation: {
    addStockToWatchlist: async (
      _parent: any,
      args: { userId: number; symbol: string },
      { prisma }: ServerContext
    ) => {
      const watchlist = await prisma.watchlist.findUnique({
        where: { userId: args.userId },
      });

      if (!watchlist) {
        throw new Error("Watchlist not found");
      }
      const updatedWatchlist = await prisma.watchlist.update({
        where: { id: watchlist.id },
        data: {
          stocks: {
            push: args.symbol,
          },
        },
      });

      return "Stock added to watchlist";
    },
  },
};

export const resolvers = {
  Query: {
    stocks: async (
      _parent: any,
      args: { limit: number; offset: number },
      { prisma }: any
    ) => {
      return await prisma.stock.findMany({
        take: args.limit || 10, // Default to 10 if limit is not provided
        skip: args.offset || 0, // Default to 0 if offset is not provided
      });
    },
    allStocks: async (_parent: any, args: any, { prisma }: ServerContext) =>
      await prisma.stock.findMany(),
    stock: async (
      _parent: any,
      args: { symbol: string },
      { prisma }: ServerContext
    ) => {
      const stock = await prisma.stock.findUnique({
        where: {
          symbol: args.symbol,
        },
      });

      return stock;
    },

    // news resolvers
    getAllNews: async (_parent: any, args: any, { prisma }: ServerContext) =>
      await prisma.news.findMany(),

    // user resolvers
    getAllUsers: async (_parent: any, args: any, { prisma }: ServerContext) => {
      try {
        return await prisma.user.findMany();
      } catch (error) {
        return error;
      }
    },
    ...watchlistResolvers.Query,
  },

  Mutation: {
    createUser: async (
      _parent: any,
      args: { name: string; email: string },
      { prisma }: ServerContext
    ) => {
      const id = v4();
      try {
        return await prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            watchlistId: id,
            watchlist: {
              create: {
                id,
                stocks: [],
              },
            },
          },
        });
      } catch (error) {
        return error;
      }
    },
    ...watchlistResolvers.Mutation,
  },
};
