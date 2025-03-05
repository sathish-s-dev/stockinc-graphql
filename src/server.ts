import { ApolloServer, ApolloConfig } from "@apollo/server";
import {
  startStandaloneServer,
  StartStandaloneServerOptions,
} from "@apollo/server/standalone";
// import data from "../db.json" assert { type: "json" };
import { readFileSync } from "fs";
import { typeDefs } from "./graphql/schemas";
import { resolvers as res, resolvers } from "./graphql/resolvers";
import { PrismaClient } from "@prisma/client";

const rawData = readFileSync("./db.json", "utf8");
const data = JSON.parse(rawData);

// console.log(data);
const prisma = new PrismaClient();

export interface ServerContext {
  prisma: PrismaClient;
}

const server = new ApolloServer({
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

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => ({ prisma }),
  });

  console.log(`🚀  Server ready at: ${url}`);
}

startServer();
