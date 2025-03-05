import { NextFunction, Request, Response } from "express";
import { config } from "dotenv";

config();

const checkApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers["x-api-key"]; // Get API key from headers
  const validApiKey = process.env.API_KEY; // Get stored API key

  if (!apiKey) {
    res.status(401).json({ message: "API Key is required" });
    return;
  }

  if (apiKey !== validApiKey) {
    res.status(403).json({ message: "Invalid API Key" });
    return;
  }

  next(); // Proceed to next middleware or route handler
};

export default checkApiKey;
