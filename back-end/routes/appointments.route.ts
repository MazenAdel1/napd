import express from "express";
const router = express.Router();

import { verifyToken } from "../middleware/verifyToken";

import { getClientsAppointments } from "../controllers/appointments.controller";

router.route("/").get(verifyToken, getClientsAppointments);

export default router;
