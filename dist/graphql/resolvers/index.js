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
exports.resolvers = exports.watchlistResolvers = void 0;
const uuid_1 = require("uuid");
exports.watchlistResolvers = {
    Query: {
        getWatchlistStocks: (_parent_1, args_1, _a) => __awaiter(void 0, [_parent_1, args_1, _a], void 0, function* (_parent, args, { prisma }) {
            // 1️⃣ Get the watchlist for the given user
            const watchlist = yield prisma.watchlist.findUnique({
                where: { userId: +args.userId },
            });
            console.log(watchlist);
            if (!watchlist) {
                throw new Error("Watchlist not found");
            }
            // 2️⃣ Fetch all stocks where symbol is in the watchlist's stockSymbols array
            const stocks = yield prisma.stock.findMany({
                where: { symbol: { in: watchlist.stocks } },
            });
            console.log(stocks);
            // 3️⃣ Return the watchlist with the stocks included
            return Object.assign(Object.assign({}, watchlist), { stocks });
        }),
    },
    Mutation: {
        addStockToWatchlist: (_parent_2, args_2, _b) => __awaiter(void 0, [_parent_2, args_2, _b], void 0, function* (_parent, args, { prisma }) {
            const watchlist = yield prisma.watchlist.findUnique({
                where: { userId: args.userId },
            });
            if (!watchlist) {
                throw new Error("Watchlist not found");
            }
            const updatedWatchlist = yield prisma.watchlist.update({
                where: { id: watchlist.id },
                data: {
                    stocks: {
                        push: args.symbol,
                    },
                },
            });
            return "Stock added to watchlist";
        }),
    },
};
exports.resolvers = {
    Query: Object.assign({ stocks: (_parent_3, args_3, _c) => __awaiter(void 0, [_parent_3, args_3, _c], void 0, function* (_parent, args, { prisma }) {
            return yield prisma.stock.findMany({
                take: args.limit || 10, // Default to 10 if limit is not provided
                skip: args.offset || 0, // Default to 0 if offset is not provided
            });
        }), allStocks: (_parent_4, args_4, _d) => __awaiter(void 0, [_parent_4, args_4, _d], void 0, function* (_parent, args, { prisma }) { return yield prisma.stock.findMany(); }), stock: (_parent_5, args_5, _e) => __awaiter(void 0, [_parent_5, args_5, _e], void 0, function* (_parent, args, { prisma }) {
            const stock = yield prisma.stock.findUnique({
                where: {
                    symbol: args.symbol,
                },
            });
            return stock;
        }), 
        // news resolvers
        getAllNews: (_parent_6, args_6, _f) => __awaiter(void 0, [_parent_6, args_6, _f], void 0, function* (_parent, args, { prisma }) { return yield prisma.news.findMany(); }), 
        // user resolvers
        getAllUsers: (_parent_7, args_7, _g) => __awaiter(void 0, [_parent_7, args_7, _g], void 0, function* (_parent, args, { prisma }) {
            try {
                return yield prisma.user.findMany();
            }
            catch (error) {
                return error;
            }
        }) }, exports.watchlistResolvers.Query),
    Mutation: Object.assign({ createUser: (_parent_8, args_8, _h) => __awaiter(void 0, [_parent_8, args_8, _h], void 0, function* (_parent, args, { prisma }) {
            const id = (0, uuid_1.v4)();
            try {
                return yield prisma.user.create({
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
            }
            catch (error) {
                return error;
            }
        }) }, exports.watchlistResolvers.Mutation),
};
