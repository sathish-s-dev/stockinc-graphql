import { v4 } from "uuid";
import { ServerContext } from "../../server";
import { IUser } from "../../db/schemas/User.schema";
import { GraphQLError } from "graphql";

export const userResolvers = {
  Query: {
    getAllUsers: async (_parent: any, args: any, { User }: ServerContext) => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        return {
          data: null,
          message: "something went wrong",
          status: 500,
          error: "something went wrong on our server",
        };
      }
    },
    getUserByEmail: async (
      _parent: any,
      args: any,
      { User }: ServerContext
    ) => {
      const user = await User.findOne({ email: args.email });
      if (!user?.id) {
        throw new GraphQLError("user not found", {
          extensions: { code: "NOT_FOUND", statusCode: 404 },
        });
      }
      return user;
    },
  },
  Mutation: {
    createUser: async (
      _parent: any,
      args: { name: string; email: string },
      { User, Watchlist }: ServerContext
    ) => {
      const id = v4();

      // Check if user already exists
      const existingUser = await User.findOne({ email: args.email });
      if (existingUser && existingUser?.name) {
        throw new GraphQLError("user already exists", {
          path: ["createUser"],
          extensions: { code: "BAD_REQUEST", statusCode: 400 },
        });
      }

      // Create user
      const user = await User.insertOne({
        name: args.name,
        email: args.email,
        watchlistId: id,
      });

      if (!user.id) {
        throw new GraphQLError("something went wrong", {
          path: ["createUser"],
          extensions: { code: "INTERNAL_SERVER_ERROR", statusCode: 500 },
        });
      }

      // Create associated watchlist
      const watchlist = await Watchlist.insertOne({
        _id: id,
        userId: user._id,
        stocks: [],
        stockSymbols: ["AAPL"],
      });

      console.log(watchlist);

      return user;
    },
    createMultipleUsers: async (
      _parent: any,
      args: { count: number },
      { User, Watchlist }: ServerContext
    ) => {
      try {
        const users = [];
        console.log("User count:", args.count);
        for (let i = 0; i < args.count; i++) {
          const id = v4();
          const userObj = new User({
            name: `user-${i * Math.random()}`,
            email: `ssathish-${i * Math.random()}@gmail.com`,
            watchlistId: id,
          });

          await userObj.save();
          users.push(userObj);
        }

        console.log("Users created:", users.length);

        const watchlists = users.map((user) => ({
          _id: user.watchlistId,
          userId: user._id, // Link watchlist to user
          stockSymbols: [],
          stocks: [],
        }));

        console.log("Watchlist count:", watchlists.length);

        const insertedWatchlists = await Watchlist.insertMany(watchlists);

        console.log("Watchlists created:", insertedWatchlists.length);

        return {
          message: "Users and watchlists created successfully",
          data: users,
          error: null,
          status: 200,
        };
      } catch (error) {
        console.error("Error inserting users and watchlists:", error);
        if (error instanceof Error) {
          return {
            message: "Failed to insert users and watchlists",
            error: error.message,
            status: 400,
          };
        }
      }
    },
  },
};
