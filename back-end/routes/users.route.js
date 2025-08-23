const express = require("express");
const allowedTo = require("../middleware/allowedTo");
const { roles } = require("../utils/consts");
const {
  getAllClients,
  login,
  registerAdmin,
  deleteUser,
  getUserByToken,
} = require("../controllers/users.controller");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router
  .route("/")
  .get(verifyToken, allowedTo(roles.ADMIN), getAllClients)
  .delete(verifyToken, allowedTo(roles.ADMIN), deleteUser);

router.route("/getUserByToken").get(verifyToken, getUserByToken);

router.route("/login").post(login);
router
  .route("/registerAdmin")
  .post(verifyToken, allowedTo(roles.ADMIN), registerAdmin);

module.exports = router;
