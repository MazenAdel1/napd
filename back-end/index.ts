import "dotenv/config";

import express from "express";
import { type DefaultEventsMap, Server } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "./utils/prisma";
import cors from "cors";
import cookieParser from "cookie-parser";

import { liveSocket } from "./utils/liveSocket";

import { httpStatus } from "./utils/consts";

import type { Request, Response, NextFunction } from "express";

// routers
import {
  usersRouter,
  timeSlotsRouter,
  appointmentsRouter,
  reportsRouter,
  notificationsRouter,
} from "./routes";

import type appError from "./utils/appError.js";
import type { CustomJwtPayload } from "./types/index.js";
import type { User } from "./prisma/generated/prisma/client";

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: ["http://localhost:5173", "http://localhost:4173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
  ],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.options("/socket.io/*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/api/users", usersRouter);
app.use("/api/timeSlots", timeSlotsRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/notifications", notificationsRouter);

app.use(
  (error: typeof appError, req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");

    res.status(error.statusCode || 500).json({
      status: error.statusText || httpStatus.SERVER_ERROR.message,
      message: error.message,
      code: error.statusCode || 500,
      data: null,
    });
  },
);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  User
>(server, {
  cors: corsOptions,
  allowEIO3: true,
  transports: ["websocket", "polling"],
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as CustomJwtPayload;
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (user) {
        socket.data = user;
      }
    }
    // Allow connection even without auth (for registration)
    next();
  } catch (error) {
    // Allow connection even if token is invalid
    next();
  }
});

liveSocket(io);
