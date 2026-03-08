import type { User } from "../prisma/generated/prisma/client";
import appError from "../utils/appError.js";
import type { Request, Response, NextFunction } from "express";

export const allowedTo = (...roles: User["role"][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(appError.create("غير مسموح بالدخول", 401));
    }
    next();
  };
};
