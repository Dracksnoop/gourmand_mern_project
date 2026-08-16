import express from "express"
import {isAuthenticated} from "../middlewares/isAuthenticated";
import { cancelOrder, createCheckoutSession, getOrders, stripeWebhook } from "../controller/order.controller";
const router = express.Router();

router.route("/").get(isAuthenticated, getOrders);
router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/webhook").post(stripeWebhook);
router.route("/:orderId/cancel").put(isAuthenticated, cancelOrder);

export default router;
