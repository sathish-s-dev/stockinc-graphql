import { v4 } from "uuid";
import { ServerContext } from "../../server";

export const userResolvers = {
  Query: {
    getAllUsers: async (_parent: any, args: any, { User }: ServerContext) => {
      try {
        const users = await User.find();
        const aggregatedUsers = await User.aggregate([
          { $skip: 5 },
          {
            $project: {
              name: 1,
              email: 1,
              watchlistId: 1,
            },
          },
        ]);
        console.log(aggregatedUsers);
        return {
          data: users,
          message: "users fetched successfuly",
          status: 200,
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          message: "something went wrong",
          status: 500,
          error: "something went wrong on our server",
        };
      }
    },
  },
  Mutation: {
    createUser: async (
      _parent: any,
      args: { name: string; email: string },
      { User, Watchlist }: ServerContext
    ) => {
      try {
        const id = v4();

        // Check if user already exists
        const existingUser = await User.findOne({ email: args.email });
        if (existingUser && existingUser?.name) {
          return {
            message: "user with exists",
            status: 400,
            data: null,
            error: `user with ${args.email} already exists`,
          };
        }

        // Create user
        const user = await User.insertOne({
          name: args.name,
          email: args.email,
          watchlistId: id,
        });

        if (!user.id) {
          throw new Error("User creation failed");
        }

        // Create associated watchlist
        const watchlist = await Watchlist.insertOne({
          _id: id,
          userId: user._id,
          stocks: [],
          stockSymbols: ["AAPL"],
        });

        console.log(watchlist);

        return {
          message: "user created sucessfully",
          status: 201,
          data: [user],
          error: null,
        };
      } catch (error) {
        return {
          message: "something went wrong",
          status: 500,
          data: null,
          error: "Internal Server Error",
        };
      }
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
