require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");

const prisma = new PrismaClient().$extends(withAccelerate());

const app = express();
const cors = require("cors");
const cookiesParser = require("cookie-parser");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://abo-greda.vercel.app",
    "https://abo-greda-production.up.railway.app",
  ],
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
app.use(cookiesParser());

const PORT = process.env.PORT || 3000;

const { httpStatus } = require("./utils/consts");
const {
  registerClient,
  updateUser,
} = require("./controllers/users.controller");

const usersRouter = require("./routes/users.route");
const timeSlotsRouter = require("./routes/timeSlots.route");
const appointmentsRouter = require("./routes/appointments.route");
const reportsRouter = require("./routes/reports.route");
const {
  getAppointmentBySlotId,
  cancelAppointment,
  confirmAppointment,
} = require("./controllers/appointments.controller");

app.use("/api/users", usersRouter);
app.use("/api/timeSlots", timeSlotsRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/reports", reportsRouter);

app.use((error, req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");

  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatus.SERVER_ERROR.message,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(server, {
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (user) {
        socket.user = user;
      }
    }
    // Allow connection even without auth (for registration)
    next();
  } catch (error) {
    // Allow connection even if token is invalid
    next();
  }
});

io.on("connection", (socket) => {
  // Registration doesn't require authentication
  socket.on("add client", async (data) => {
    try {
      const newClient = await registerClient(data);
      socket.emit("client add success");
      io.emit("client added", newClient);
    } catch (error) {
      console.log("client NOT added");
      socket.emit("client add fail", error);
    }
  });

  socket.on("update client", async (data) => {
    if (!socket.user) {
      return socket.emit("error", { message: "Authentication required" });
    }

    try {
      const updatedClient = await updateUser(data, socket.user.id);
      socket.emit("client update success", updatedClient);
      io.emit("client updated", updatedClient);
    } catch {
      console.log("client NOT updated");
    }
  });

  socket.on("add appointment", async (data) => {
    if (!socket.user) {
      return socket.emit("error", { message: "Authentication required" });
    }
    try {
      const newAppointment = await getAppointmentBySlotId(data.slotId);
      io.emit("appointment added", newAppointment);
    } catch {
      console.log("appointment NOT added");
    }
  });

  socket.on("cancel appointment", async (data) => {
    if (!socket.user) {
      return socket.emit("error", { message: "Authentication required" });
    }

    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: data.appointmentId },
      });

      if (!appointment) {
        return socket.emit("error", { message: "Appointment not found" });
      }

      if (
        socket.user.role !== "ADMIN" &&
        socket.user.id !== appointment.userId
      ) {
        return socket.emit("error", { message: "Unauthorized" });
      }

      const canceledAppointment = await cancelAppointment(data.appointmentId);
      io.emit("appointment canceled", canceledAppointment);
    } catch (error) {
      console.log("appointment NOT canceled", error);
      socket.emit("error", { message: "Failed to cancel appointment" });
    }
  });

  socket.on("confirm appointment", async (data) => {
    if (!socket.user) {
      return socket.emit("error", { message: "Authentication required" });
    }
    if (socket.user.role !== "ADMIN") {
      return socket.emit("error", { message: "Unauthorized" });
    }

    try {
      const confirmedAppointment = await confirmAppointment(data.appointmentId);
      io.emit("appointment confirmed", confirmedAppointment);
    } catch {
      console.log("appointment NOT confirmed");
    }
  });
});
