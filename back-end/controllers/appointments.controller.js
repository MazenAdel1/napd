const asyncWrapper = require("../middleware/asyncWrapper");

const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");

const prisma = new PrismaClient().$extends(withAccelerate());

const { httpStatus } = require("../utils/consts");
const appError = require("../utils/appError");

const getClientsAppointments = asyncWrapper(async (req, res) => {
  const { limit } = req.query;
  const { currentUser: user } = req;

  if (user.role == "CLIENT") {
    const appointments = await prisma.appointment.findMany({
      where: {
        userId: user.id,
      },
      include: {
        timeSlot: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(limit && { take: +limit }),
    });

    return res.json({ status: httpStatus.SUCCESS, data: { appointments } });
  } else if (user.role == "ADMIN") {
    const appointments = await prisma.appointment.findMany({
      include: {
        timeSlot: true,
        user: true,
        report: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(limit && { take: +limit }),
    });

    return res.json({ status: httpStatus.SUCCESS, data: { appointments } });
  }
});

const getAppointmentBySlotId = async (slotId) => {
  const appointment = await prisma.appointment.findFirst({
    where: { timeSlotId: slotId },
    include: {
      timeSlot: true,
      user: true,
    },
  });

  return appointment;
};

const confirmAppointment = async (id) => {
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: "CONFIRMED" },
    include: {
      timeSlot: true,
      user: true,
    },
  });

  return appointment;
};

const cancelAppointment = async (id) => {
  const appointment = await prisma.appointment.delete({
    where: { id },
    include: {
      user: {
        omit: { password: true },
      },
      timeSlot: true,
    },
  });

  await prisma.timeSlot.update({
    where: { id: appointment.timeSlotId },
    data: { status: "AVAILABLE" },
  });

  return appointment;
};

module.exports = {
  getClientsAppointments,
  getAppointmentBySlotId,
  confirmAppointment,
  cancelAppointment,
};
