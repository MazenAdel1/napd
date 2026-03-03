const asyncWrapper = require("../middleware/asyncWrapper");

const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");
const { httpStatus } = require("../utils/consts");

const prisma = new PrismaClient().$extends(withAccelerate());

const getAllNotifications = asyncWrapper(async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10,
    offset = (page - 1) * limit;

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
});

const markNotificationsAsRead = asyncWrapper(async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10,
    offset = (page - 1) * limit;

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

const createNotification = async (userId, type) => {
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

module.exports = {
  createNotification,
  getAllNotifications,
  markNotificationsAsRead,
};
