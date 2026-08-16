import express from "express"
import upload from "../middlewares/multer";
import {isAuthenticated} from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";
import { addMenu, editMenu } from "../controller/menu.controller";

const router = express.Router();

router.route("/").post(isAuthenticated, isAdmin, upload.single("image"), addMenu);
router.route("/:id").put(isAuthenticated, isAdmin, upload.single("image"), editMenu);

export default router;
