import { Document, Model, Schema } from "mongoose";
import mongoose from "mongoose";

export interface ICustomer {
  _id: string;
  name: string;
  anonymous_key: string;
  email: string;
  subscription: string | mongoose.Schema.Types.ObjectId;
  owner: string | mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerModel extends Omit<ICustomer, "_id">, Document {
  _id: string;
}

const customerSchema: Schema<CustomerModel> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    anonymous_key: { type: String, required: true, unique: true },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Customer: Model<CustomerModel> = mongoose.model<CustomerModel>("Customer", customerSchema);
