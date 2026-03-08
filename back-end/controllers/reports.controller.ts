import { prisma } from "../utils/prisma";
import { asyncWrapper } from "../middleware/asyncWrapper";
import appError from "../utils/appError";
import { httpStatus } from "../utils/consts";
import type { Request, Response, NextFunction } from "express";

export const getReports = asyncWrapper(async (req: Request, res: Response) => {
  const { id, limit } = req.query;

  let data;

  if (id) {
    data = await prisma.report.findUnique({
      where: {
        id: id as string,
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

export const addReport = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { appointmentId } = req.params;
    const { description } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId as string },
      include: { report: true },
    });

    if (appointment?.report) {
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
        appointmentId: appointmentId as string,
      },
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
      data: { report: newReport },
    });
  },
);

export const updateReport = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { description } = req.body;

    const report = await prisma.report.update({
      where: { id: id as string },
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
  },
);

export const deleteReport = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const report = await prisma.report.delete({
      where: { id: id as string },
    });

    return res.json({ status: httpStatus.SUCCESS, data: { report } });
  },
);
