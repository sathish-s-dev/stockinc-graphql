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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const db_json_1 = __importDefault(require("../../db.json"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Math.random().toString(36).substring(2, 9);
        // const user = await prisma.user.create({
        //   data: {
        //     email: "sssathish73362@gmail.com",
        //     name: "Sathish S",
        //     watchlistId: id,
        //     watchlist: {
        //       create: {
        //         stocks: ["AAPL", "MSFT", "GOOGL"],
        //         id,
        //       },
        //     },
        //   },
        // });
        // const user = await prisma.user.findUnique({
        //   where: {
        //     email: "sssathish73362@gmail.com",
        //   },
        // });
        // const watchlist = await prisma.watchlist.findUnique({
        //   where: {
        //     id: user?.watchlistId,
        //   },
        // });
        const stocks = yield prisma.stock.createMany({
            data: db_json_1.default.stocks,
        });
        const news = yield prisma.news.createMany({
            data: db_json_1.default.news,
        });
        console.log("Database seeded!", stocks, news);
    });
}
main()
    .catch((e) => console.error(e))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
