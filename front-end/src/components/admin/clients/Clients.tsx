import { socket } from "@/lib/consts";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import type { DataWrapper, User } from "@/types";
import ClientCard from "./ClientCard";
import DataTemplate from "@/components/shared/DataTemplate";

export default function Clients({ limit, seeAllButton }: DataWrapper) {
  const [clients, setClients] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { clients } = (
        await axios.get("/users", {
          withCredentials: true,
          params: { limit },
        })
      ).data.data;
      setClients(clients);
      setIsLoading(false);
    })();

    socket.on("client added", (newClient) => {
      setClients((prev) => [...prev, newClient]);
    });

    return () => {
      socket.off("client added");
    };
  }, [limit]);

  return (
    <DataTemplate
      data={clients}
      title="العملاء"
      link="/admin/clients"
      seeAllButton={seeAllButton}
      isLoading={isLoading}
    >
      {clients.map((client) => (
        <ClientCard client={client} key={client.id} setClients={setClients} />
      ))}
    </DataTemplate>
  );
}
