import { socket } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import type { DataWrapper, User } from "@/types";
import ClientCard from "./ClientCard";
import { Skeleton } from "@/components/ui/skeleton";
import DataTemplate from "@/components/DataTemplate";

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

  if (isLoading)
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="block h-52 w-full bg-gray-300" />
        ))}
      </div>
    );

  return (
    <DataTemplate
      data={clients}
      title="العملاء"
      link="/admin/clients"
      seeAllButton={seeAllButton}
    >
      {clients.map((client) => (
        <ClientCard client={client} key={client.id} setClients={setClients} />
      ))}
    </DataTemplate>
  );
}
