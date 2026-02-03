import { Edit, Ellipsis, LoaderCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRef } from "react";
import type { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

type ActionsMenuProps = {
  deleteAction?: () => void;
  EditForm?: (
    closeRef: React.RefObject<HTMLButtonElement | null>,
  ) => React.ReactNode;
  isDeleting: boolean;
  triggerClassName?: ClassNameValue;
};

export default function ActionsMenu({
  deleteAction,
  EditForm,
  isDeleting,
  triggerClassName,
}: ActionsMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={cn("size-7", triggerClassName)}>
        <Button variant={"ghost"}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup className="flex flex-col gap-1">
          {!!EditForm && (
            <Dialog>
              <DialogTrigger
                asChild
                className="w-full border border-blue-300 bg-blue-50 text-blue-500 hover:bg-blue-100"
              >
                <Button>
                  <Edit />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogClose className="sr-only" ref={closeRef} />
                {EditForm(closeRef)}
              </DialogContent>
            </Dialog>
          )}
          {!!deleteAction && (
            <Dialog>
              <DialogTrigger
                asChild
                className="w-full border border-red-300 bg-red-50 text-red-500 hover:bg-red-100"
              >
                <Button>
                  <Trash />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <p className="text-center">هل أنت متأكد من حذف هذا العنصر؟</p>
                <Button
                  variant={"destructive"}
                  onClick={deleteAction}
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
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
