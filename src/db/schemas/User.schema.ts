import { Schema, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  watchlistId: string;
}

export const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  watchlistId: {
    type: String,
    required: true,
  },
});

export const User = model("User", userSchema);
