import type { Appointment, DataWrapper } from "@/types";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { socket } from "@/lib/utils";
import DataTemplate from "@/components/shared/DataTemplate";
import React from "react";

export type AppointmentsListProps = DataWrapper & {
  header?: React.ReactNode;
  userId?: string;
  isAdmin?: boolean;
  renderAppointment: (appointment: Appointment) => React.ReactNode;
  link: string;
};

export default function AppointmentsList({
  limit,
  seeAllButton,
  header,
  userId,
  isAdmin = false,
  renderAppointment,
  link,
}: AppointmentsListProps) {
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
      if (newAppointment.user.id === userId || isAdmin)
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
  }, [limit, userId, isAdmin]);

  return (
    <>
      {header}
      <DataTemplate
        data={appointments}
        title="الحجوزات"
        link={link}
        seeAllButton={seeAllButton}
        isLoading={isLoading}
      >
        {appointments.map((appointment) => (
          <React.Fragment key={appointment.id}>
            {renderAppointment(appointment)}
          </React.Fragment>
        ))}
      </DataTemplate>
    </>
  );
}
