"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext } from "react";

export const AuthContext = createContext(null);

const ContextProvider = ({ children }) => {
  //! Get User
  const { data: user, refetch: userRefetch } = useQuery({
    queryKey: ["profile", "user", "NavBar"],
    queryFn: async () => {
      try {
        const { data } = await axios.get("/api/users/me");
        return data.user;
      } catch (error) {
        return null;
      }
    },
  });
  const info = { user, userRefetch };
  return <AuthContext.Provider value={info}>{children}</AuthContext.Provider>;
};

export default ContextProvider;
