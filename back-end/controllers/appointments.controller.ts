import { asyncWrapper } from "../middleware/asyncWrapper";
import { prisma } from "../utils/prisma";
import type { Request, Response } from "express";
import { httpStatus } from "../utils/consts";

export const getClientsAppointments = asyncWrapper(
  async (req: Request, res: Response) => {
    const { limit } = req.query;
    const { currentUser: user } = req;

    if (user.role == "CLIENT") {
      const appointments = await prisma.appointment.findMany({
        where: {
          userId: user.id as string,
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

      res.json({ status: httpStatus.SUCCESS, data: { appointments } });
      return;
    }

    return;
  },
);

export const getAppointmentBySlotId = async (slotId: string) => {
  const appointment = await prisma.appointment.findFirst({
    where: { timeSlotId: slotId },
    include: {
      timeSlot: true,
      user: true,
    },
  });

  return appointment;
};

export const confirmAppointment = async (id: string) => {
  const appointment = await prisma.appointment.update({
    where: { id: id as string },
    data: { status: "CONFIRMED" },
    include: {
      timeSlot: true,
      user: true,
    },
  });

  return appointment;
};

export const cancelAppointment = async (id: string) => {
  const appointment = await prisma.appointment.delete({
    where: { id: id as string },
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
