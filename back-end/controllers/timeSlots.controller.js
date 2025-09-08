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
    include: {
      appointment: true,
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

const addMultipleTimeSlots = asyncWrapper(async (req, res, next) => {
  const { date, slotsStartTime, slotsEndTime, slotDuration } = req.body;

  const newDate = new Date(date);
  newDate.setUTCHours(0, 0, 0, 0);

  const newStartTime = new Date(newDate);
  newStartTime.setHours(
    +slotsStartTime.split(":")[0],
    +slotsStartTime.split(":")[1]
  );
  let startHour = newStartTime.getHours();

  const newEndTime = new Date(newDate);
  newEndTime.setHours(+slotsEndTime.split(":")[0], +slotsEndTime.split(":")[1]);
  const endHour = newEndTime.getHours();

  let slots = [];

  if (startHour + +slotDuration >= endHour) {
    const error = appError.create(
      "يجب أن تكون بداية المواعيد قبل النهاية",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message
    );
    return next(error);
  }

  while (startHour + +slotDuration <= endHour) {
    const existingTimeSlot = await prisma.timeSlot.findFirst({
      where: {
        date: newDate,
        startTime: new Date(new Date(date).setHours(startHour, 0, 0, 0)),
        endTime: new Date(
          new Date(date).setHours(startHour + +slotDuration, 0, 0, 0)
        ),
      },
    });

    if (existingTimeSlot) {
      startHour += +slotDuration;
      continue;
    }

    slots.push({
      date: newDate,
      startTime: new Date(new Date(date).setHours(startHour, 0, 0, 0)),
      endTime: new Date(
        new Date(date).setHours(startHour + +slotDuration, 0, 0, 0)
      ),
    });

    startHour += +slotDuration;
  }

  const data = await prisma.timeSlot.createManyAndReturn({
    data: slots,
  });

  return res.json({ status: httpStatus.SUCCESS, data: { timeSlots: data } });
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

  const result = await prisma.$transaction(async (tx) => {
    const timeSlot = await tx.timeSlot.findUnique({
      where: { id },
      select: { startTime: true, status: true },
    });

    if (timeSlot.startTime < new Date()) {
      throw appError.create(
        "لا يمكن حجز موعد في وقت مضى",
        httpStatus.BAD_REQUEST.code,
        httpStatus.BAD_REQUEST.message
      );
    }

    if (timeSlot.status === "BOOKED") {
      throw appError.create(
        "تم حجز هذا الموعد بالفعل",
        httpStatus.BAD_REQUEST.code,
        httpStatus.BAD_REQUEST.message
      );
    }

    await tx.appointment.create({
      data: {
        status: "PENDING",
        timeSlotId: id,
        userId: req.currentUser.id,
      },
    });

    const updatedTimeSlot = await tx.timeSlot.update({
      where: {
        id,
      },
      data: {
        status: "BOOKED",
      },
      include: {
        appointment: true,
      },
    });

    return updatedTimeSlot;
  });

  return res.json({
    status: httpStatus.SUCCESS,
    data: { timeSlot: result },
  });
});

module.exports = {
  getTimeSlotsByDate,
  addTimeSlot,
  addMultipleTimeSlots,
  deleteTimeSlot,
  bookTimeSlot,
};
