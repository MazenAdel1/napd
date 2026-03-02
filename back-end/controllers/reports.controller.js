const asyncWrapper = require("../middleware/asyncWrapper");

const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");

const prisma = new PrismaClient().$extends(withAccelerate());

const { httpStatus } = require("../utils/consts");
const appError = require("../utils/appError");

const getReports = asyncWrapper(async (req, res) => {
  const { id, limit } = req.query;

  let data;

  if (id) {
    data = await prisma.report.findUnique({
      where: {
        id,
      },
      include: {
        appointment: {
          include: {
            user: true,
          },
        },
      },
    });
  } else {
    data = await prisma.report.findMany({
      include: {
        appointment: {
          include: {
            user: true,
          },
        },
      },
      ...(limit && { take: +limit }),
      orderBy: {
        createAt: "desc",
      },
    });
  }

  return res.json({
    status: httpStatus.SUCCESS,
    data: { ...(data instanceof Array ? { reports: data } : { report: data }) },
  });
});

const addReport = asyncWrapper(async (req, res, next) => {
  const { appointmentId } = req.params;
  const { description } = req.body;

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { report: true },
  });

  if (appointment.report) {
    const error = appError.create(
      "تم كتابة تقرير لهذا الحجز مسبقا",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message,
    );
    return next(error);
  }

  const newReport = await prisma.report.create({
    data: {
      description: description,
      appointmentId: appointmentId,
    },
    include: {
      appointment: {
        include: {
          user: true,
        },
      },
    },
  });

  return res.json({ status: httpStatus.SUCCESS, data: { report: newReport } });
});

const updateReport = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  const report = await prisma.report.update({
    where: { id },
    data: { description },
    include: {
      appointment: {
        include: {
          user: true,
        },
      },
    },
  });

  return res.json({
    status: httpStatus.SUCCESS,
    data: { report },
  });
});

const deleteReport = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const report = await prisma.report.delete({
    where: { id },
  });

  return res.json({ status: httpStatus.SUCCESS, data: { report } });
});

module.exports = {
  getReports,
  addReport,
  updateReport,
  deleteReport,
};
