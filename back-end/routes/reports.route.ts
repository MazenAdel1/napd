import express from "express";
import { allowedTo, verifyToken } from "../middleware";
import { roles } from "../utils/consts";
import {
  getReports,
  addReport,
  updateReport,
  deleteReport,
} from "../controllers";

const router = express.Router();

router.route("/").get(verifyToken, allowedTo(roles.ADMIN), getReports);
router
  .route("/:appointmentId")
  .post(verifyToken, allowedTo(roles.ADMIN), addReport);

router
  .route("/:id")
  .patch(verifyToken, allowedTo(roles.ADMIN), updateReport)
  .delete(verifyToken, allowedTo(roles.ADMIN), deleteReport);

export default router;
