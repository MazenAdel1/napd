const asyncWrapper = require("../middleware/asyncWrapper");

const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");

const prisma = new PrismaClient().$extends(withAccelerate());

const { httpStatus } = require("../utils/consts");
const generateJWT = require("../utils/generateJWT");
const appError = require("../utils/appError");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUserByToken = asyncWrapper(async (req, res) => {
  const token = req.cookies.token;

  const decoded = jwt.decode(token);

  const user = await prisma.user.findUnique({
    where: {
      phoneNumber: decoded.phoneNumber,
    },
  });

  delete user.password;
  return res.json({ status: httpStatus.SUCCESS, data: { user } });
});

const getAllClients = asyncWrapper(async (req, res) => {
  const clients = await prisma.user.findMany({
    where: {
      role: "CLIENT",
    },
  });
  return res.json({ status: httpStatus.SUCCESS, data: { clients } });
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    const error = appError.create(
      "هوية المستخدم مطلوبة",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message
    );
    return next(error);
  }

  console.log(id);

  const user = await prisma.user.delete({
    where: {
      id,
    },
  });
  return res.json({ status: httpStatus.SUCCESS, data: { user } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { name, phoneNumber, password } = req.body;

  if (!name || !phoneNumber) {
    const error = appError.create(
      "الإسم و رقم الهاتف مطلوبان",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message
    );
    return next(error);
  }

  const user = await prisma.user.findUnique({
    where: {
      name,
      phoneNumber,
    },
  });

  if (!user) {
    const error = appError.create(
      "المستخدم غير موجود",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message
    );
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (!matchedPassword) {
    const error = appError.create(
      "كلمة المرور غير صحيحة",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message
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
    sameSite: "None",
    secure: true,
  });

  return res.json({ status: httpStatus.SUCCESS, data: { token } });
});

const logout = asyncWrapper(async (req, res) => {
  res.clearCookie("token");
  return res.json({ status: httpStatus.SUCCESS });
});

const registerAdmin = asyncWrapper(async (req, res, next) => {
  const { name, phoneNumber, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: {
      phoneNumber,
    },
  });

  if (userExists) {
    const error = appError.create(
      "المستخدم موجود بالفعل",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message
    );
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      phoneNumber,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  delete user.password;
  res.json({ status: httpStatus.SUCCESS, data: { user } });
});

const registerClient = async (data) => {
  const { phoneNumber, password } = data;

  const userExists = await prisma.user.findUnique({
    where: {
      phoneNumber,
    },
  });

  if (userExists) {
    throw appError.create(
      "المستخدم موجود بالفعل",
      httpStatus.BAD_REQUEST.code,
      httpStatus.BAD_REQUEST.message
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
  });

  delete user.password;
  return user;
};

module.exports = {
  getUserByToken,
  getAllClients,
  deleteUser,
  login,
  registerAdmin,
  registerClient,
  logout,
};
