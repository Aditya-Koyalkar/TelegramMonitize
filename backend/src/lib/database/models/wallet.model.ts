import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWallet {
  _id: string;
  owner: string | mongoose.Schema.Types.ObjectId;
  balance: number;
  withdraw: number;
  createdAt: Date;
  updatedAt: Date;
}

// Extend Mongoose's Document and override _id type
interface WalletModel extends Omit<IWallet, "_id">, Document {
  _id: string;
}

const walletSchema: Schema<WalletModel> = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: { type: Number, required: true, default: 0 },
    withdraw: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Wallet: Model<WalletModel> = mongoose.models.Wallet || mongoose.model<WalletModel>("Wallet", walletSchema);
