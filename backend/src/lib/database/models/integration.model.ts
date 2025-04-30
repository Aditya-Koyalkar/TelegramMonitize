import mongoose, { Schema, Document, Model } from "mongoose";

export interface IIntegration {
  _id: string;
  owner: string | mongoose.Schema.Types.ObjectId;
  paypal: {
    email: string;
    currency: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Extend Mongoose's Document and override _id type
interface IntegrationModel extends Omit<IIntegration, "_id">, Document {
  _id: string;
}

const integrationSchema: Schema<IntegrationModel> = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paypal: {
      email: {
        type: String,
        required: true,
      },
      currency: {
        type: String,
        required: true,
        default: "USD",
      },
    },
  },
  { timestamps: true }
);

export const Integration: Model<IntegrationModel> = mongoose.models.Integration || mongoose.model<IntegrationModel>("Integration", integrationSchema);
