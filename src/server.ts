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

// ✅ Load Environment Variables
config();

const rawData = readFileSync("./db.json", "utf8");
const data = JSON.parse(rawData);

// console.log(data);
const prisma = new PrismaClient();

export interface ServerContext {
  prisma: PrismaClient;
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
  const { url } = await startStandaloneServer(server, {
    listen: { port: +process.env.PORT! || 4000 },
    context: async () => ({ prisma }),
  });

  console.log(`🚀  Server ready at: ${url}`);
}

startServer();
