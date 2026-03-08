import express from "express";
import { verifyToken } from "../middleware";
import { getAllNotifications, markNotificationsAsRead } from "../controllers";

const router = express.Router();

router.route("/").get(verifyToken, getAllNotifications);
router.route("/mark-as-read").patch(verifyToken, markNotificationsAsRead);

export default router;
