import type { User } from "@/types";
import { Activity, Hospital, MapPin, Phone, Pill } from "lucide-react";
import type React from "react";
import axios from "@/lib/axios";
import { useState } from "react";
import ActionsMenu from "@/components/shared/ActionsMenu";

type Props = {
  client: User;
  setClients: React.Dispatch<React.SetStateAction<User[]>>;
};

export default function ClientCard({ client, setClients }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteUser = async () => {
    try {
      setIsDeleting(true);
      await axios.delete("/users", {
        params: { id: client.id },
        withCredentials: true,
      });
      setClients((prev) => prev.filter((c) => c.id !== client.id));
      setIsDeleting(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex overflow-y-auto rounded-md border-t-4 border-green-400 bg-white p-3 shadow-md">
      <ul className="flex flex-1 flex-col gap-2">
        <li className="text-xl font-bold">
          {client.name} - {client.age} سنة
        </li>
        <li className="flex items-center gap-2">
          <Phone size={14} /> {client.phoneNumber}
        </li>

        <li className="flex items-center gap-2">
          <MapPin size={14} /> {client.address || "لا يوجد عنوان"}
        </li>

        <li className="flex items-center gap-2">
          <Hospital size={14} />
          {client.hasPastOperations ? (
            client.pastOperationsDesc ? (
              <p className="whitespace-pre-wrap">{client.pastOperationsDesc}</p>
            ) : (
              "لديه عمليات سابقة (لا يوجد تفاصيل)"
            )
          ) : (
            "ليس لديه عمليات سابقة"
          )}
        </li>

        <li className="flex items-center gap-2">
          <Pill size={14} />
          {client.isTakingMedications ? (
            client.medicationsDesc ? (
              <p className="whitespace-pre-wrap">{client.medicationsDesc}</p>
            ) : (
              "يستخدم أدوية حاليا (لا يوجد تفاصيل)"
            )
          ) : (
            "لا يستخدم أدوية حاليا"
          )}
        </li>

        {!!client.healthStatus && (
          <>
            <hr className="my-1" />
            <li className="flex items-center gap-2">
              <Activity size={14} />
              <p className="whitespace-pre-wrap">{client.healthStatus}</p>
            </li>
          </>
        )}
      </ul>
      <ActionsMenu deleteAction={deleteUser} isDeleting={isDeleting} />
    </div>
  );
}
