import { betterAuth } from "better-auth";
import { CLIENT_DOMAIN, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../env.js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import client from "./db.js";
import { createAuthMiddleware } from "better-auth/api";
import db from "../database/db.js";
import { Wallet } from "../database/models/wallet.model.js";
import { ObjectId } from "mongodb";

const dbClient = client.db();
export const auth = betterAuth({
  trustedOrigins: [CLIENT_DOMAIN],
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
  database: mongodbAdapter(dbClient),
  hooks: {
    after: createAuthMiddleware(async (c) => {
      const newSession = c.context.newSession;
      const user = newSession?.user;
      if (user) {
        try {
          await db();
          const isWalletAvail = await Wallet.findOne({
            owner: user.id,
          });
          if (isWalletAvail) {
            return;
          }
          const wallet = await Wallet.create({
            owner: user.id,
          });
          const userCollection = dbClient.collection("user");
          await userCollection.updateOne(
            {
              _id: new ObjectId(user.id),
            },
            {
              $set: {
                wallet: wallet._id,
              },
            }
          );
        } catch (e) {
          console.log(e);
          throw c.redirect("/sign-in");
        }
      }
    }),
  },
});
