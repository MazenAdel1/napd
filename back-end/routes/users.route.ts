import express from "express";
import { allowedTo, verifyToken } from "../middleware";
import { roles } from "../utils/consts";
import {
  getAllClients,
  login,
  registerAdmin,
  deleteUser,
  getUserByToken,
  logout,
  httpUpdateUser,
} from "../controllers";

const router = express.Router();

router
  .route("/")
  .get(verifyToken, allowedTo(roles.ADMIN), getAllClients)
  .delete(verifyToken, allowedTo(roles.ADMIN), deleteUser);

router.route("/getUserByToken").get(verifyToken, getUserByToken);

router.route("/update").patch(verifyToken, httpUpdateUser);

router.route("/login").post(login);
router.route("/logout").post(verifyToken, logout);
router
  .route("/registerAdmin")
  .post(verifyToken, allowedTo(roles.ADMIN), registerAdmin);

export default router;
