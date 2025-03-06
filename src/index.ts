import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { ApolloServer, BaseContext } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser";
import { typeDefs } from "./graphql/schemas/index";
import { resolvers } from "./graphql/resolvers/index";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import checkApiKey from "./middlewares/checkApiKey";

// ✅ Load Environment Variables
config();

const prisma = new PrismaClient();

async function startServer() {
  const app = express();

  // ✅ Enable CORS
  app.use(
    cors({
      origin: ["http://localhost:5173", "https://stockinc.vercel.app"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    })
  );

  // ✅ Correct Usage of Rate Limiting

  // Apply rate limiting globally
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    headers: true, // Include rate limit info in headers
  });

  app.use(express.json());

  // Apply rate limiting to all routes globally
  app.use(limiter);

  // ✅ Create Apollo Server
  const server = new ApolloServer<BaseContext>({ typeDefs, resolvers });
  await server.start();

  // ✅ Apply Middleware for GraphQL route only
  app.use(
    "/graphql",
    json(),
    checkApiKey,
    expressMiddleware(server, {
      context: async () => ({ prisma }),
    })
  );

  const port = process.env.PORT || 4000;
  // ✅ Start Express Server
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}/graphql`);
  });
}

// Call the async function
startServer().catch((err) => console.error("Error starting server:", err));
