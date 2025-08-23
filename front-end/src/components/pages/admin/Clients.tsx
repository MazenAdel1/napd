import { socket } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Client } from "@/types";
import ClientCard from "./ClientCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { clients } = (
        await axios.get("http://localhost:3000/api/users", {
          withCredentials: true,
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
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold py-3">العملاء</h1>
      <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="block h-52 w-full bg-gray-300" />
            ))
          : clients.map((client) => (
              <ClientCard
                client={client}
                key={client.id}
                setClients={setClients}
              />
            ))}
      </div>
    </div>
  );
}
