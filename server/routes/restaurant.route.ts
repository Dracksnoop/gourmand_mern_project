import express from "express"
import { createRestaurant, getRestaurant, getRestaurantOrder, getSingleRestaurant, searchRestaurant, updateOrderStatus, updateRestaurant } from "../controller/restaurant.controller";
import upload from "../middlewares/multer";
import {isAuthenticated} from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

// Browsing is deliberately open. Requiring a session to look at restaurants meant a
// first-time visitor landed on an empty page before they had any reason to sign up.
router.route("/search").get(searchRestaurant);
router.route("/search/:searchText").get(searchRestaurant);

router.route("/").post(isAuthenticated, isAdmin, upload.single("imageFile"), createRestaurant);
router.route("/").get(isAuthenticated, isAdmin, getRestaurant);
router.route("/").put(isAuthenticated, isAdmin, upload.single("imageFile"), updateRestaurant);
router.route("/order").get(isAuthenticated, isAdmin, getRestaurantOrder);
router.route("/order/:orderId/status").put(isAuthenticated, isAdmin, updateOrderStatus);

// Must stay last: a bare "/:id" would otherwise swallow "/order" and "/search".
router.route("/:id").get(getSingleRestaurant);

export default router;
