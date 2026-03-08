import { asyncWrapper } from "../middleware/asyncWrapper";
import { prisma } from "../utils/prisma";
import { httpStatus } from "../utils/consts";
import { generateJWT } from "../utils/generateJWT";
import appError from "../utils/appError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { User } from "../prisma/generated/prisma/client";

export const getUserByToken = asyncWrapper(
  async (req: Request, res: Response) => {
    const token = req.cookies.token;

    const decoded = jwt.decode(token) as User;

    const user = (await prisma.user.findUnique({
      where: {
        phoneNumber: decoded?.phoneNumber,
      },
    })) as Partial<User>;

    delete user?.password;
    return res.json({ status: httpStatus.SUCCESS, data: { user } });
  },
);

export const getAllClients = asyncWrapper(
  async (req: Request, res: Response) => {
    const { limit } = req.query;

    const clients = await prisma.user.findMany({
      where: {
        role: "CLIENT",
      },
      ...(limit && { take: +limit }),
      omit: { password: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.json({ status: httpStatus.SUCCESS, data: { clients } });
  },
);

export const deleteUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;

    if (!id) {
      const error = appError.create(
        "هوية المستخدم مطلوبة",
        httpStatus.BAD_REQUEST.code,
        httpStatus.BAD_REQUEST.message,
      );
      return next(error);
    }

    const user = await prisma.user.delete({
      where: {
        id: id as string,
      },
    });
    return res.json({ status: httpStatus.SUCCESS, data: { user } });
  },
);

export const httpUpdateUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = updateUser(req.body, req.currentUser.id);
    return res.json({ status: httpStatus.SUCCESS, data: { user } });
  },
);

export const updateUser = async (data: User, userId: User["id"]) => {
  const { id, ...rest } = data;

  if (!id) {
    throw appError.create(
      "هوية المستخدم مطلوبة",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message,
    );
  }

  if (id !== userId) {
    throw appError.create(
      "لا يمكنك تعديل بيانات مستخدم آخر",
      httpStatus.FORBIDDEN.code,
      httpStatus.FORBIDDEN.message,
    );
  }

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...rest,
    },
    omit: { password: true },
  });

  return user;
};

export const login = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, phoneNumber, password } = req.body;

    if (!name || !phoneNumber) {
      const error = appError.create(
        "الإسم و رقم الهاتف مطلوبان",
        httpStatus.BAD_REQUEST.code,
        httpStatus.BAD_REQUEST.message,
      );
      return next(error);
    }

    const user = await prisma.user.findUnique({
      where: {
        phoneNumber: phoneNumber as string,
      },
    });

    if (!user) {
      const error = appError.create(
        "المستخدم غير موجود",
        httpStatus.BAD_REQUEST.code,
        httpStatus.BAD_REQUEST.message,
      );
      return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      const error = appError.create(
        "كلمة المرور غير صحيحة",
        httpStatus.BAD_REQUEST.code,
        httpStatus.BAD_REQUEST.message,
      );
      return next(error);
    }

    const token = await generateJWT({
      name: user.name,
      phoneNumber: user.phoneNumber,
      id: user.id,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });

    return res.json({ status: httpStatus.SUCCESS, data: { token } });
  },
);

export const logout = asyncWrapper(async (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.json({ status: httpStatus.SUCCESS });
});

export const registerAdmin = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, phoneNumber, password } = req.body;

    const userExists = await prisma.user.findUnique({
      where: {
        phoneNumber: phoneNumber as string,
      },
    });

    if (userExists) {
      const error = appError.create(
        "المستخدم موجود بالفعل",
        httpStatus.BAD_REQUEST.code,
        httpStatus.BAD_REQUEST.message,
      );
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = (await prisma.user.create({
      data: {
        name,
        phoneNumber,
        password: hashedPassword,
        role: "ADMIN",
      },
    })) as Partial<User>;

    delete user.password;
    res.json({ status: httpStatus.SUCCESS, data: { user } });
  },
);

export const registerClient = async (data: User) => {
  const { phoneNumber, password } = data;

  const userExists = await prisma.user.findUnique({
    where: {
      phoneNumber: phoneNumber as string,
    },
  });

  if (userExists) {
    throw appError.create(
      "المستخدم موجود بالفعل",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message,
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      ...data,
      phoneNumber,
      password: hashedPassword,
      role: "CLIENT",
    },
    omit: {
      password: true,
    },
  });

  return user;
};
