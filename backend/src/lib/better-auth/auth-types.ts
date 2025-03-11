import { auth } from "./auth.js";

export const Session = auth.$Infer.Session.session;
export const User = auth.$Infer.Session.user;

export interface AuthSession {
  Variables: {
    user: typeof User | null;
    session: typeof Session | null;
  };
}