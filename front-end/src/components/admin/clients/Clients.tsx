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
      setClients((prev) => [newClient, ...prev]);
    });

    socket.on("client updated", (updatedClient) => {
      setClients((prev) =>
        prev.map((client) =>
          client.id === updatedClient.id ? updatedClient : client,
        ),
      );
    });

    return () => {
      socket.off("client added");
      socket.off("client updated");
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
