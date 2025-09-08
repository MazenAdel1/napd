const express = require("express");
const router = express.Router();

const allowedTo = require("../middleware/allowedTo");
const { roles } = require("../utils/consts");
const verifyToken = require("../middleware/verifyToken");

const {
  getTimeSlotsByDate,
  addTimeSlot,
  addMultipleTimeSlots,
  deleteTimeSlot,
  bookTimeSlot,
} = require("../controllers/timeSlots.controller");

router.route("/day/:date").get(getTimeSlotsByDate);
router
  .route("/")
  .post(verifyToken, allowedTo(roles.ADMIN), addTimeSlot)
  .delete(verifyToken, allowedTo(roles.ADMIN), deleteTimeSlot);

router
  .route("/multiple")
  .post(verifyToken, allowedTo(roles.ADMIN), addMultipleTimeSlots);

router.route("/book").post(verifyToken, allowedTo(roles.CLIENT), bookTimeSlot);

module.exports = router;
