const { Prisma } = require("@prisma/client");
const appError = require("../utils/appError");
const { httpStatus } = require("../utils/consts");

const asyncWrapper = (asyncFn) => {
  return (req, res, next) => {
    asyncFn(req, res, next).catch((error) => {
      // handle not found record
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        const notFound = appError.create(
          "البيانات غير موجودة",
          httpStatus.NOT_FOUND.code,
          httpStatus.NOT_FOUND.message
        );
        return next(notFound);
      }
      return next(error);
    });
  };
};

module.exports = asyncWrapper;
