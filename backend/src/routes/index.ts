import { Hono } from "hono";
import authRoutes from "./auth/auth.js";
import statsRoutes from "./stats/stats.route.js";
import groupRoutes from "./group/group.js";
import walletRoute from "./wallet/wallet.js";
import payoutHistoryRoutes from "./payout-history/payout-history.js";
const routes = new Hono();

routes.route("/v1/user", authRoutes);
routes.route("/v1/dashboard", statsRoutes);
routes.route("/v1/dashboard", groupRoutes);
routes.route("/v1/dashboard", walletRoute);
routes.route("/v1/dashboard", payoutHistoryRoutes);
export default routes;
