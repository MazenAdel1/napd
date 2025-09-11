require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const cors = require("cors");
const cookiesParser = require("cookie-parser");

const corsOptions = {
  origin: ["http://localhost:5173", "https://abo-greda.vercel.app"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookiesParser());

const PORT = process.env.PORT || 3000;

const { httpStatus } = require("./utils/consts");
const { registerClient } = require("./controllers/users.controller");

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
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatus.SERVER_ERROR.message,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

const server = createServer(app);
const io = new Server(server, {
  transports: ["websocket"],
  cors: {
    methods: ["GET", "POST", "PATCH", "DELETE"],
    ...corsOptions,
  },
});

io.on("connection", (socket) => {
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

  socket.on("add appointment", async (data) => {
    try {
      const newAppointment = await getAppointmentBySlotId(data.slotId);
      io.emit("appointment added", newAppointment);
    } catch {
      console.log("appointment NOT added");
    }
  });

  socket.on("cancel appointment", async (data) => {
    try {
      const canceledAppointment = await cancelAppointment(data.appointmentId);
      io.emit("appointment canceled", canceledAppointment);
    } catch {
      console.log("appointment NOT canceled");
    }
  });

  socket.on("confirm appointment", async (data) => {
    try {
      const confirmedAppointment = await confirmAppointment(data.appointmentId);
      io.emit("appointment confirmed", confirmedAppointment);
    } catch {
      console.log("appointment NOT confirmed");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
