import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction {
  _id: string;
  status: string;
  anonymous_key: string;
  currency_code: string;
  of_group: string | mongoose.Schema.Types.ObjectId;
  price: 0;
  subscription: string | mongoose.Schema.Types.ObjectId;
  owner: string | mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Extend Mongoose's Document and override _id type
interface TransactionModel extends Omit<ITransaction, "_id">, Document {
  _id: string;
}

const transactionSchema: Schema<TransactionModel> = new Schema(
  {
    price: {
      type: Number,
    },
    currency_code: { type: String, default: "USD", required: true },
    status: { type: String, default: "created" },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    of_group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    anonymous_key: { type: String, required: true, unique: true },
    owner: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Transaction: Model<TransactionModel> = mongoose.models.Transaction || mongoose.model<TransactionModel>("Transaction", transactionSchema);
