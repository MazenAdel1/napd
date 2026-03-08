import type { Request, Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { prisma } from "../utils/prisma";
import { httpStatus } from "../utils/consts";
import type { Notification, User } from "../prisma/generated/prisma/client";

export const getAllNotifications = asyncWrapper(
  async (req: Request, res: Response) => {
    const { page = 1 } = req.query;
    const limit = 10,
      offset = ((page as number) - 1) * limit;

    const [notifications, count] = await prisma.$transaction([
      prisma.notification.findMany({
        include: {
          user: {
            omit: { password: true },
          },
        },
        skip: +offset,
        take: +limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count(),
    ]);

    const notReadCount = await prisma.notification.count({
      where: { isRead: false },
    });

    return res.json({
      status: httpStatus.SUCCESS,
      data: {
        notifications,
        notReadCount,
        totalPages: Math.ceil(count / limit),
      },
    });
  },
);

export const markNotificationsAsRead = asyncWrapper(async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10,
    offset = ((page as number) - 1) * limit;

  await prisma.notification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });

  const notifications = await prisma.notification.findMany({
    include: {
      user: {
        omit: { password: true },
      },
    },
    skip: +offset,
    take: +limit,
    orderBy: { createdAt: "desc" },
  });

  return res.json({
    status: httpStatus.SUCCESS,
    data: { notifications, notReadCount: 0 },
  });
});

export const createNotification = async (
  userId: User["id"],
  type: Notification["type"],
) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
    },
    include: {
      user: {
        omit: { password: true },
      },
    },
  });

  return notification;
};
