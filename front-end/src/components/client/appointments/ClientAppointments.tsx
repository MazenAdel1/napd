import type { Appointment, DataWrapper } from "@/types";
import axios from "@/lib/axios";
import { use, useEffect, useState } from "react";
import { socket } from "@/lib/utils";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/UserProvider";
import DataTemplate from "@/components/shared/DataTemplate";
import { ArrowRight } from "lucide-react";
import ClientAppointmentCard from "./ClientAppointmentCard";

export default function ClientAppointments({
  limit,
  seeAllButton,
}: DataWrapper) {
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
      if (newAppointment.user.id === user?.id)
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
  }, [limit, user?.id]);

  return (
    <>
      <Button asChild variant={"outline"}>
        <Link to="..">
          <ArrowRight className="size-4" />
          الرجوع
        </Link>
      </Button>
      <DataTemplate
        data={appointments}
        title="الحجوزات"
        link="/appointments"
        seeAllButton={seeAllButton}
        isLoading={isLoading}
      >
        {appointments.map((appointment) => (
          <ClientAppointmentCard
            appointment={appointment}
            key={appointment.id}
          />
        ))}
      </DataTemplate>
    </>
  );
}
