import { socket } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import type { User } from "@/types";
import ClientCard from "./ClientCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Clients({ limit }: { limit?: number }) {
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
      <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="block h-52 w-full bg-gray-300" />
        ))}
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold py-3">العملاء</h1>
      <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {clients.length > 0 ? (
          clients.map((client) => (
            <ClientCard
              client={client}
              key={client.id}
              setClients={setClients}
            />
          ))
        ) : (
          <p>لا يوجد عملاء</p>
        )}
      </div>
    </div>
  );
}
