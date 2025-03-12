import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PORT } from "./lib/env.js";
import { auth } from "./lib/better-auth/auth.js";
import db from "./lib/database/db.js";
import addSession from "./middleware/session.middleware.js";
import configCors from "./middleware/cors.middleware.js";
import sessionValidator from "./middleware/unauthorized-access.middleware.js";
import errorHandler from "./middleware/error.middleware.js";
import { initBot } from "./bot/index.js";

const app = new Hono();
const port = Number(PORT) || 8080;

db();

app.use(configCors);
app.use(addSession);
app.use(sessionValidator);
app.onError(errorHandler);
app.get("/", (c) => {
  return c.text("Welcome to the telegram bot API!");
});

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

//bot

initBot();

serve(
  {
    fetch: app.fetch,
    port: 8078,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
