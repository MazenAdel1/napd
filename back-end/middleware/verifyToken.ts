import jwt from "jsonwebtoken";
import { httpStatus } from "../utils/consts";
import appError from "../utils/appError";
import type { NextFunction, Request, Response } from "express";
import type { CustomJwtPayload } from "../types";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  let token;

  if (
    authHeader &&
    typeof authHeader === "string" &&
    authHeader.startsWith("Bearer ")
  ) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    const error = appError.create(
      "token is required",
      httpStatus.UNAUTHORIZED.code,
      httpStatus.UNAUTHORIZED.message,
    );
    return next(error);
  }

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET);
    req.currentUser = currentUser;
    next();
  } catch {
    const error = appError.create(
      "invalid token",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message,
    );
    return next(error);
  }
};
