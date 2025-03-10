import { ApolloServer, ApolloConfig, BaseContext } from "@apollo/server";
import {
  startStandaloneServer,
  StartStandaloneServerOptions,
} from "@apollo/server/standalone";
// import data from "../db.json" assert { type: "json" };
import { readFileSync } from "fs";
import { typeDefs } from "./graphql/schemas";
import { resolvers as res, resolvers } from "./graphql/resolvers";
import { PrismaClient } from "@prisma/client";

import { config } from "dotenv";
import { connectDb } from "./db/connectDb";
import { Model, Schema } from "mongoose";
import { Stock, IStock } from "./db/schemas/Stock.schema";
import { News, INews } from "./db/schemas/News.schema";
import { IUser, User } from "./db/schemas/User.schema";
import { IWatchlist, Watchlist } from "./db/schemas/Watchlist.schema";

// ✅ Load Environment Variables
config();

const rawData = readFileSync("./db.json", "utf8");
const data = JSON.parse(rawData);

// console.log(data);
const prisma = new PrismaClient();

export interface ServerContext {
  prisma: PrismaClient;
  Stock: Model<IStock>;
  News: Model<INews>;
  User: Model<IUser>;
  Watchlist: Model<IWatchlist>;
}

const server = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
});

// async function insertStocks() {
//   try {
//     const result = await prisma.stock.createMany({
//       data: data.stocks,
//     });
//     console.log("Inserted stocks:", result);
//   } catch (error) {
//     console.error("Error inserting stocks:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// // insertStocks();

// const serverOptions: StartStandaloneServerOptions<BaseContext> = {
//   context: async () => ({ prisma }),
// };

async function startServer() {
  connectDb();
  const { url } = await startStandaloneServer(server, {
    listen: { port: +process.env.PORT! || 4000 },
    context: async () => ({ prisma, Stock, News, User, Watchlist }),
  });

  console.log(`🚀  Server ready at: ${url}`);
}

startServer();
