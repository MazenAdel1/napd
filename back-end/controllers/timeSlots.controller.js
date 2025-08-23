const asyncWrapper = require("../middleware/asyncWrapper");

const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");

const prisma = new PrismaClient().$extends(withAccelerate());

const { httpStatus } = require("../utils/consts");
const appError = require("../utils/appError");

const getTimeSlotsByDate = asyncWrapper(async (req, res) => {
  const { date } = req.params;

  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const timeSlots = await prisma.timeSlot.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  return res.json({ status: httpStatus.SUCCESS, data: { timeSlots } });
});

const addTimeSlot = asyncWrapper(async (req, res, next) => {
  const { date, startTime, endTime } = req.body;

  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0);

  const newDate = new Date(date);
  newDate.setUTCHours(0, 0, 0, 0);

  const newStartTime = new Date(newDate);
  newStartTime.setHours(+startTime.split(":")[0], +startTime.split(":")[1]);

  const newEndTime = new Date(newDate);
  newEndTime.setHours(+endTime.split(":")[0], +endTime.split(":")[1]);

  if (newDate < currentDate) {
    const error = appError.create(
      "لا يمكن ان يكون التاريخ قبل اليوم",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message
    );
    return next(error);
  }

  if (
    newDate.toISOString() == currentDate.toISOString() &&
    (newStartTime < new Date() || newEndTime < new Date())
  ) {
    if (newStartTime < new Date()) {
      const error = appError.create(
        "لا يمكن ان يكون وقت البدء قبل الآن",
        httpStatus.BAD_REQUEST.code,
        httpStatus.BAD_REQUEST.message
      );
      return next(error);
    }
  }

  if (newStartTime >= newEndTime) {
    const error = appError.create(
      "يجب أن يكون وقت الانتهاء بعد وقت البدء",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message
    );
    return next(error);
  }

  const existingTimeSlot = await prisma.timeSlot.findFirst({
    where: {
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
    },
  });

  if (existingTimeSlot) {
    const error = appError.create(
      "الموعد موجود بالفعل",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message
    );
    return next(error);
  }

  const timeSlot = await prisma.timeSlot.create({
    data: {
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
    },
  });

  return res.json({ status: httpStatus.SUCCESS, data: { timeSlot } });
});

const deleteTimeSlot = asyncWrapper(async (req, res) => {
  const { id } = req.query;

  const timeSlot = await prisma.timeSlot.delete({
    where: {
      id,
    },
  });

  return res.json({ status: httpStatus.SUCCESS, data: { timeSlot } });
});

const bookTimeSlot = asyncWrapper(async (req, res) => {
  const { id } = req.query;

  const timeSlot = await prisma.timeSlot.update({
    where: {
      id,
    },
    data: {
      status: "BOOKED",
    },
  });

  const appointment = await prisma.appointment.create({
    data: {
      status: "PENDING",
      timeSlotId: id,
      userId: req.currentUser.id,
    },
  });

  return res.json({
    status: httpStatus.SUCCESS,
    data: { timeSlot, appointment },
  });
});

module.exports = {
  getTimeSlotsByDate,
  addTimeSlot,
  deleteTimeSlot,
  bookTimeSlot,
};
