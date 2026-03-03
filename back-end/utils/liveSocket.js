const {
  getAppointmentBySlotId,
  confirmAppointment,
  cancelAppointment,
} = require("../controllers/appointments.controller");
const {
  CreateNotification,
} = require("../controllers/notifications.controller");
const {
  registerClient,
  updateUser,
} = require("../controllers/users.controller");

const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");

const prisma = new PrismaClient().$extends(withAccelerate());

const liveSocket = (io) =>
  io.on("connection", (socket) => {
    socket.on("add client", async (data) => {
      try {
        const newClient = await registerClient(data);
        socket.emit("client add success");
        io.emit("client added", newClient);
        const newNotification = await CreateNotification(
          newClient.id,
          "CLIENT_REGISTERED",
        );
        io.emit("notification", newNotification);
      } catch (error) {
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
        const notification = await CreateNotification(
          newAppointment.userId,
          "APPOINTMENT_BOOKED",
        );
        io.emit("notification", notification);
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

        const notification = await CreateNotification(
          canceledAppointment.userId,
          "APPOINTMENT_CANCELLED",
        );
        io.emit("notification", notification);
      } catch (error) {
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
        const confirmedAppointment = await confirmAppointment(
          data.appointmentId,
        );
        io.emit("appointment confirmed", confirmedAppointment);
      } catch {
        console.log("appointment NOT confirmed");
      }
    });
  });

module.exports = {
  liveSocket,
};
