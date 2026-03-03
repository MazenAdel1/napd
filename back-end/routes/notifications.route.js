const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
  getAllNotifications,
  markNotificationsAsRead,
} = require("../controllers/notifications.controller");

router.route("/").get(verifyToken, getAllNotifications);
router.route("/mark-as-read").patch(verifyToken, markNotificationsAsRead);

module.exports = router;
