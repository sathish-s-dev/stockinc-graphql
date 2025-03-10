import { ServerContext } from "../../server";
import { Response } from "../../types";

export const newsResolvers = {
  Query: {
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
  },
  Mutation: {
    // news resolvers
  },
};
