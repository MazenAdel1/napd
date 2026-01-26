import type { User } from "@/types";
import {
  Activity,
  Hospital,
  LoaderCircle,
  MapPin,
  Phone,
  Pill,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type React from "react";
import axios from "@/lib/axios";
import { useState } from "react";

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
    <ul className="group relative flex flex-col gap-2 overflow-y-auto rounded-md border-t-4 border-green-400 bg-white p-3 shadow-md">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="absolute top-2 left-2 opacity-0 transition group-hover:opacity-100"
            variant={"destructive"}
          >
            <Trash />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <p className="text-center">هل أنت متأكد من حذف هذا العميل؟</p>
          <Button
            variant={"destructive"}
            onClick={deleteUser}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <LoaderCircle className="size-5 animate-spin" />
            ) : (
              "حذف"
            )}
          </Button>
        </DialogContent>
      </Dialog>
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
  );
}
