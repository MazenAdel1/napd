const jwt = require("jsonwebtoken");
const { httpStatus } = require("../utils/consts");
const appError = require("../utils/appError");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    const error = appError.create(
      "token is required",
      httpStatus.UNAUTHORIZED.code,
      httpStatus.UNAUTHORIZED.message
    );
    return next(error);
  }

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = appError.create(
      "invalid token",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message
    );
    return next(error);
  }
};

module.exports = verifyToken;
