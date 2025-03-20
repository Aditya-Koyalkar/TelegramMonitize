import { Hono } from "hono";
import authRoutes from "./auth/auth.js";
import statsRoutes from "./stats/stats.route.js";
import groupRoutes from "./group/group.js";
const routes = new Hono();

routes.route("/v1/user", authRoutes);
routes.route("/v1/dashboard", statsRoutes);
routes.route("/v1/dashboard", groupRoutes);
export default routes;
