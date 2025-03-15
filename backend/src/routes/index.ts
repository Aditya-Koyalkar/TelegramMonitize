import { Hono } from "hono";
import authRoutes from "./auth/auth.js";
const routes = new Hono();

routes.route("/v1/user", authRoutes);

export default routes;
