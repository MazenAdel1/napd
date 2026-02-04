import type { User } from "@/types";

export type ClientCardProps = {
  client: User;
  setClients: React.Dispatch<React.SetStateAction<User[]>>;
};
