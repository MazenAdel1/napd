import axios from "@/lib/axios";
import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "./types";

type Props = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<null>>;
  isLoading: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<Props>({
  user: null,
  setUser: () => {},
  isLoading: true,
});

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const { user } = (
          await axios.get("/users/getUserByToken", {
            withCredentials: true,
          })
        ).data.data;

        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}
