import { Skeleton } from "@/components/ui/skeleton";
import type { Appointment, DataWrapper } from "@/types";
import axios from "@/lib/axios";
import { use, useEffect, useState } from "react";
import AppointmentCard from "./AppointmentCard";
import { socket } from "@/lib/utils";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/UserProvider";
import DataTemplate from "../DataTemplate";

export default function Appointments({ limit, seeAllButton }: DataWrapper) {
  const { user } = use(UserContext);
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
      if (newAppointment.user.id == user?.id || user?.role === "ADMIN")
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
  }, [limit, user?.id, user?.role]);

  if (isLoading)
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {" "}
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="block h-52 w-full bg-gray-300" />
        ))}
      </div>
    );

  return (
    <>
      {user?.role === "CLIENT" && (
        <Button asChild>
          <Link to="..">الرجوع</Link>
        </Button>
      )}
      <DataTemplate
        data={appointments}
        title="الحجوزات"
        link="/admin/appointments"
        seeAllButton={seeAllButton}
      >
        {appointments.map((appointment) => (
          <AppointmentCard appointment={appointment} key={appointment.id} />
        ))}
      </DataTemplate>
    </>
  );
}
