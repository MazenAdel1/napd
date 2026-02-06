import { EDIT_PROFILE_INPUTS, EDIT_PROFILE_SCHEMA } from "./consts";
import type { EditProfileFormSchema } from "./types";
import { Form } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { socket } from "@/lib/consts";
import type { FormProps } from "@/types";
import { UserContext } from "@/UserProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { use, useRef } from "react";
import { useForm } from "react-hook-form";

export default function EditProfile() {
  const { user, setUser } = use(UserContext);
  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm<EditProfileFormSchema>({
    resolver: zodResolver(EDIT_PROFILE_SCHEMA),
    defaultValues: Object.fromEntries(
      Object.entries(user!).map(([key, value]) =>
        value !== null && value !== undefined ? [key, value] : [key, ""],
      ),
    ),
  });

  const onSubmit: FormProps<EditProfileFormSchema>["onSubmit"] = async (
    values,
  ) => {
    try {
      socket.emit("update client", { id: user?.id, ...values });
      socket.on("client updated", (updatedUser) => {
        setUser(updatedUser);
      });
      closeRef.current?.click();
    } catch {
      console.error("error");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          تعديل <Edit />
        </Button>
      </DialogTrigger>
      <DialogClose className="hidden" ref={closeRef} />
      <DialogContent className="max-h-[calc(100dvh-20px)] overflow-y-auto">
        <Form
          form={form}
          inputs={EDIT_PROFILE_INPUTS(user ?? undefined)}
          onSubmit={onSubmit}
          submitText="حفظ التعديلات"
          className="max-h-fit bg-none shadow-none"
        />
      </DialogContent>
    </Dialog>
  );
}
