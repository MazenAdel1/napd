import type { User } from "../prisma/generated/prisma/client";
import type { DefaultEventsMap, Server } from "socket.io";

import {
  getAppointmentBySlotId,
  confirmAppointment,
  cancelAppointment,
} from "../controllers/appointments.controller";
import { createNotification } from "../controllers/notifications.controller";
import { registerClient, updateUser } from "../controllers/users.controller";

import { prisma } from "./prisma";

export const liveSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, User>,
) =>
  io.on("connection", (socket) => {
    socket.on("add client", async (data) => {
      try {
        const newClient = await registerClient(data);
        socket.emit("client add success");
        io.emit("client added", newClient);
        const newNotification = await createNotification(
          newClient.id,
          "CLIENT_REGISTERED",
        );
        io.emit("notification", newNotification);
      } catch (error) {
        socket.emit("client add fail", error);
      }
    });

    socket.on("update client", async (data) => {
      if (!socket.data) {
        return socket.emit("error", { message: "Authentication required" });
      }

      try {
        const updatedClient = await updateUser(data, socket.data.id);
        socket.emit("client update success", updatedClient);
        io.emit("client updated", updatedClient);
      } catch {
        console.log("client NOT updated");
      }
    });

    socket.on("add appointment", async (data) => {
      if (!socket.data) {
        return socket.emit("error", { message: "Authentication required" });
      }
      try {
        const newAppointment = await getAppointmentBySlotId(data.slotId);
        io.emit("appointment added", newAppointment);
        const notification = await createNotification(
          newAppointment?.userId,
          "APPOINTMENT_BOOKED",
        );
        io.emit("notification", notification);
      } catch {
        console.log("appointment NOT added");
      }
    });

    socket.on("cancel appointment", async (data) => {
      if (!socket.data) {
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
          socket.data.role !== "ADMIN" &&
          socket.data.id !== appointment.userId
        ) {
          return socket.emit("error", { message: "Unauthorized" });
        }

        const canceledAppointment = await cancelAppointment(data.appointmentId);
        io.emit("appointment canceled", canceledAppointment);

        if (socket.data.role !== "ADMIN") {
          const notification = await createNotification(
            canceledAppointment.userId,
            "APPOINTMENT_CANCELLED",
          );
          io.emit("notification", notification);
        }
      } catch (error) {
        socket.emit("error", { message: "Failed to cancel appointment" });
      }
    });

    socket.on("confirm appointment", async (data) => {
      if (!socket.data) {
        return socket.emit("error", { message: "Authentication required" });
      }
      if (socket.data.role !== "ADMIN") {
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
