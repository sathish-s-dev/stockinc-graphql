"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
// import data from "../db.json" assert { type: "json" };
const fs_1 = require("fs");
const schemas_1 = require("./graphql/schemas");
const resolvers_1 = require("./graphql/resolvers");
const client_1 = require("@prisma/client");
const rawData = (0, fs_1.readFileSync)("./db.json", "utf8");
const data = JSON.parse(rawData);
// console.log(data);
const prisma = new client_1.PrismaClient();
const server = new server_1.ApolloServer({
    typeDefs: schemas_1.typeDefs,
    resolvers: resolvers_1.resolvers,
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
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const { url } = yield (0, standalone_1.startStandaloneServer)(server, {
            listen: { port: 4000 },
            context: () => __awaiter(this, void 0, void 0, function* () { return ({ prisma }); }),
        });
        console.log(`🚀  Server ready at: ${url}`);
    });
}
startServer();
