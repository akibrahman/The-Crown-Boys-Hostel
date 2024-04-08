"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext } from "react";

export const AuthContext = createContext(null);

const ContextProvider = ({ children }) => {
  //! Get User
  const { data: user, refetch: userRefetch } = useQuery({
    queryKey: ["profile", "user", "all"],
    queryFn: async () => {
      try {
        const { data } = await axios.get("/api/users/me");
        return data.user;
      } catch (error) {
        return null;
      }
    },
  });
  //! Get Manager
  const { data: manager, refetch: managerRefetch } = useQuery({
    queryKey: ["manager", "user", "profile", user?.manager],
    queryFn: async ({ queryKey }) => {
      try {
        const { data } = await axios.get(
          `/api/users/manager?managerId=${queryKey[3]}`
        );
        return data.manager;
      } catch (error) {
        return null;
      }
    },
    enabled: user?.manager ? true : false,
  });
  const info = { user, userRefetch, manager, managerRefetch };
  return <AuthContext.Provider value={info}>{children}</AuthContext.Provider>;
};

export default ContextProvider;
