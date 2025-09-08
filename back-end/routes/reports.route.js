const express = require("express");
const router = express.Router();

const allowedTo = require("../middleware/allowedTo");
const { roles } = require("../utils/consts");
const verifyToken = require("../middleware/verifyToken");

const {
  getReports,
  addReport,
  updateReport,
  deleteReport,
} = require("../controllers/reports.controller");

router.route("/").get(verifyToken, allowedTo(roles.ADMIN), getReports);
router
  .route("/:appointmentId")
  .post(verifyToken, allowedTo(roles.ADMIN), addReport);

router
  .route("/:id")
  .patch(verifyToken, allowedTo(roles.ADMIN), updateReport)
  .delete(verifyToken, allowedTo(roles.ADMIN), deleteReport);

module.exports = router;
