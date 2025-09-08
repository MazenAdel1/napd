const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
  getClientsAppointments,
} = require("../controllers/appointments.controller");

router.route("/").get(verifyToken, getClientsAppointments);

module.exports = router;
