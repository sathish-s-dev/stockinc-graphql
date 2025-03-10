import { v4 } from "uuid";
import { Stock } from "../../db/schemas/Stock.schema";

import { ServerContext } from "../../server";
import { Response } from "../../types";
import { userResolvers } from "./user.reslover";
import { watchlistResolvers } from "./watchlist.resolver";
import { newsResolvers } from "./news.resolver";
import { stockResolvers } from "./stock.resolver";

export const resolvers = {
  Query: {
    // stock resolvers
    ...stockResolvers.Query,
    // news resolvers
    ...newsResolvers.Query,
    // user resolvers
    ...userResolvers.Query,
    // watchlist resolvers
    ...watchlistResolvers.Query,
  },

  Mutation: {
    // stock resolvers
    ...stockResolvers.Mutation,
    // news resolvers
    ...newsResolvers.Mutation,
    // user resolvers
    ...userResolvers.Mutation,
    // watchlist resolvers
    ...watchlistResolvers.Mutation,
  },
};
