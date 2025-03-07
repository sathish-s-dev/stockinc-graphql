import { model, Schema } from "mongoose";
import { IStock } from "./Stock.schema";

interface IWatchlist extends Document {
  _id: string;
  userId: string;
  stocks: IStock[];
  stockSymbols: string[];
}

export const watchlistSchema = new Schema<IWatchlist>({
  _id: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  stocks: {
    type: [String],
    required: true,
  },
  stockSymbols: {
    type: [String],
    required: true,
  },
});

export const Watchlist = model("Watchlist", watchlistSchema);
