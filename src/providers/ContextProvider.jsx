"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useState } from "react";

export const AuthContext = createContext(null);

const ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  //! Get User
  const { data: user, refetch: userRefetch } = useQuery({
    queryKey: ["profile", "user", "all"],
    queryFn: async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/users/me");
        return data.user;
      } catch (error) {
        return null;
      } finally {
        setLoading(false);
      }
    },
  });
  //! Get Manager
  const { data: manager, refetch: managerRefetch } = useQuery({
    queryKey: ["manager", "user", "profile", user?.manager],
    queryFn: async ({ queryKey }) => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/api/users/manager?managerId=${queryKey[3]}`
        );
        return data.manager;
      } catch (error) {
        return null;
      } finally {
        setLoading(false);
      }
    },
    enabled: user?.manager ? true : false,
  });
  const info = { user, userRefetch, loading, manager, managerRefetch };
  return <AuthContext.Provider value={info}>{children}</AuthContext.Provider>;
};

export default ContextProvider;
