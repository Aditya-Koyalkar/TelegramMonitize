import { betterAuth } from "better-auth";
import { CLIENT_DOMAIN, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../env.js";

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
});
