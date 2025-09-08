import type { User } from "@/types";
import {
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
    <ul className="border-t-4 border-green-400 relative group rounded-md flex flex-col gap-2 bg-white shadow-md p-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="absolute top-2 left-2 group-hover:opacity-100 opacity-0 transition"
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
              <LoaderCircle className="animate-spin size-5" />
            ) : (
              "حذف"
            )}
          </Button>
        </DialogContent>
      </Dialog>
      <li className="font-bold text-xl">
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
        {client.hasPastOperations
          ? client.pastOperationsDesc
          : "ليس لديه عمليات سابقة"}
      </li>

      <li className="flex items-center gap-2">
        <Pill size={14} />
        {client.isTakingMedications
          ? client.medicationsDesc
          : "لا يستخدم أدوية حاليا"}
      </li>
    </ul>
  );
}
