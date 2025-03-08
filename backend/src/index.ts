import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PORT } from "./lib/env.js";

const app = new Hono();
const port = Number(PORT) || 8080;

app.get("/", (c) => {
  return c.text("Welcome to the telegram bot API!");
});

serve(
  {
    fetch: app.fetch,
    port: port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
