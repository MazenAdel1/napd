import { Prisma } from "../prisma/generated/prisma/client";
import appError from "../utils/appError";
import { httpStatus } from "../utils/consts";
import type { Request, Response, NextFunction } from "express";

type AsyncFnProps = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response | void>;

export const asyncWrapper = (asyncFn: AsyncFnProps) => {
  return (req: Request, res: Response, next: NextFunction) => {
    asyncFn(req, res, next).catch((error) => {
      // handle not found record
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        const notFound = appError.create(
          "البيانات غير موجودة",
          httpStatus.NOT_FOUND.code,
          httpStatus.NOT_FOUND.message,
        );
        return next(notFound);
      }
      return next(error);
    });
  };
};
