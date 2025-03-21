import { model, Schema } from "mongoose";
import { connectDb } from "../connectDb";

export interface IStock extends Document {
  id: Number;
  symbol: String;
  company: String;
  current_price: Number;
  change: Number;
  change_percent: Number;
  market_cap: String;
  volume: String;
  pe_ratio: Number;
  dividend_yield: Number;
  logo: String;
}

const StockSchema = new Schema<IStock>({
  symbol: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  current_price: {
    type: String,
    required: true,
  },
  volume: {
    type: String,
    required: true,
  },
  change: {
    type: String,
    required: true,
  },
  change_percent: {
    type: String,
    required: true,
  },
  market_cap: {
    type: String,
    required: true,
  },
  pe_ratio: {
    type: String,
    required: true,
  },
});

export const Stock = model("Stock", StockSchema);

// async function addStock() {
//   connectDb();
//   const stock = new Stock({
//     symbol: "AAPL",
//     name: "Apple Inc.",
//     price: 150,
//     volume: 1000000,
//     change: 10,
//     change_percent: 5,
//     market_cap: 1000000000,
//     pe_ratio: 30,
//   });
//   //   await stock.save();

//   Stock.create(stock);
//   console.log("Stock added:", stock);
// }

// addStock();
