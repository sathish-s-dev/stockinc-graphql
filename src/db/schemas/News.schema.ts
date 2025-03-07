import { Schema, Document, model } from "mongoose";

export interface INews extends Document {
  id: Number;
  title: String;
  description: String;
  image: String;
  category: String;
  timestamp: String;
}

const newsSchema = new Schema<INews>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

export const News = model("News", newsSchema);
