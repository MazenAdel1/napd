import type { Appointment, DataWrapper } from "@/types";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { socket } from "@/lib/utils";
import DataTemplate from "@/components/shared/DataTemplate";
import AdminAppointmentCard from "./AdminAppointmentCard";

export default function AdminAppointments({
  limit,
  seeAllButton,
}: DataWrapper) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { appointments } = (
        await axios.get("/appointments", {
          withCredentials: true,
          params: { limit },
        })
      ).data.data;
      setAppointments(appointments);
      setIsLoading(false);
    })();

    socket.on("appointment added", (newAppointment) => {
      setAppointments((prev) => [newAppointment, ...prev]);
    });

    socket.on("appointment confirmed", (confirmedAppointment) => {
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === confirmedAppointment.id
            ? confirmedAppointment
            : appointment,
        ),
      );
    });

    socket.on("appointment canceled", (canceledAppointment) => {
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== canceledAppointment.id),
      );
    });

    return () => {
      socket.off("appointment added");
      socket.off("appointment confirmed");
      socket.off("appointment canceled");
    };
  }, [limit]);

  return (
    <DataTemplate
      data={appointments}
      title="الحجوزات"
      link="/admin/appointments"
      seeAllButton={seeAllButton}
      isLoading={isLoading}
    >
      {appointments.map((appointment) => (
        <AdminAppointmentCard appointment={appointment} key={appointment.id} />
      ))}
    </DataTemplate>
  );
}
