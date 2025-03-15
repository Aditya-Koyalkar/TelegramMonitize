import { SERVER_DOMAIN } from "@/utils/env";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: SERVER_DOMAIN, // the base url of your auth server
});

export const { useSession, signOut } = authClient;
