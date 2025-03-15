import mongoose, { Model, Schema } from "mongoose";
import { Document } from "mongoose";

export interface ISubscription {
  _id: mongoose.Types.ObjectId | string;
  owner: mongoose.Types.ObjectId | string;
  subscriber: mongoose.Types.ObjectId | string;
  of_group: mongoose.Types.ObjectId | string;
  subscription_key: string;
  price: number;
  currency_code: string;
  amount: number;
  telegram_user_id: number;
  billing: {
    cycle: "month" | "year";
    billing_start: Date;
    billing_end: Date;
  };
  status: "activated" | "canceled";
  anonymous_key: string;
  gateway?: {
    provider: "stripe" | "paddle";
    paddle: {
      price_id: string;
      subscription: {
        id: string;
        entity_type: string;
      };
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

interface SubscriptionModel extends Omit<ISubscription, "_id">, Document {
  _id: string;
}

const subscriptionSchema: Schema<SubscriptionModel> = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    telegram_user_id: Number,
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    currency_code: { type: String, default: "USD", required: true },
    of_group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    subscription_key: { type: String, required: true, unique: true },
    anonymous_key: { type: String, required: true, unique: true },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    billing: {
      cycle: { type: String, enum: ["month", "year"] },
      billing_start: { type: Date },
      billing_end: { type: Date },
    },
    status: {
      type: String,
      required: true,
      enum: ["activated", "canceled"],
    },
    gateway: {
      provider: {
        type: String,
        enum: ["stripe", "paddle"],
      },
      paddle: {
        price_id: { type: String },
        subscription: {
          id: { type: String },
          entity_type: { type: String },
        },
      },
    },
  },
  { timestamps: true }
);

export const Subscription: Model<SubscriptionModel> =
  mongoose.models.Subscription || mongoose.model<SubscriptionModel>("Subscription", subscriptionSchema);
