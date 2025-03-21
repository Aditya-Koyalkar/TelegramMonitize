import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayout {
  _id: string;
  owner: string | mongoose.Schema.Types.ObjectId;
  amount: number;
  paypal: {
    payout_batch_id: string;
    payout_item_id: string;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extend Mongoose's Document and override _id type
interface PayoutModel extends Omit<IPayout, "_id">, Document {
  _id: string;
}

const payoutSchema: Schema<PayoutModel> = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "created",
    },
    paypal: {
      payout_batch_id: { type: String, required: true },
      payout_item_id: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const Payout: Model<PayoutModel> = mongoose.models.Payout || mongoose.model<PayoutModel>("Payout", payoutSchema);
