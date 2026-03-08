import express from "express";
import { allowedTo, verifyToken } from "../middleware";
import { roles } from "../utils/consts";
import {
  getTimeSlotsByDate,
  addTimeSlot,
  addMultipleTimeSlots,
  deleteTimeSlot,
  bookTimeSlot,
} from "../controllers";

const router = express.Router();

router.route("/day/:date").get(getTimeSlotsByDate);
router
  .route("/")
  .post(verifyToken, allowedTo(roles.ADMIN), addTimeSlot)
  .delete(verifyToken, allowedTo(roles.ADMIN), deleteTimeSlot);

router
  .route("/multiple")
  .post(verifyToken, allowedTo(roles.ADMIN), addMultipleTimeSlots);

router.route("/book").post(verifyToken, allowedTo(roles.CLIENT), bookTimeSlot);

export default router;
