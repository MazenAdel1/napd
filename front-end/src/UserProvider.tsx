import axios from "axios";
import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Client } from "./types";

type Props = {
  user: Client | null;
  setUser: React.Dispatch<React.SetStateAction<null>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<Props>({
  user: null,
  setUser: () => {},
});

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const { user } = (
        await axios.get("http://localhost:3000/api/users/getUserByToken", {
          withCredentials: true,
        })
      ).data.data;

      setUser(user);
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
