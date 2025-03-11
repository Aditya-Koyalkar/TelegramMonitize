import { cors } from "hono/cors";
import { CLIENT_DOMAIN } from "../lib/env.js";

const configCors = cors({
  origin: CLIENT_DOMAIN,
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS", "DELETE"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
});

export default configCors;
