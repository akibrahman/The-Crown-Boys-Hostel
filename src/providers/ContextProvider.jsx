"use client";

import NoInternetPage from "@/Components/NoInternetPage/NoInternetPage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useState } from "react";
import { Detector } from "react-detect-offline";

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
        if (data.success) return { ...data.user, success: true };
        else return { success: false, msg: "unauthirized" };
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
  return (
    <>
      <Detector
        render={({ online }) =>
          online ? (
            <AuthContext.Provider value={info}>{children}</AuthContext.Provider>
          ) : (
            <NoInternetPage />
          )
        }
      />
    </>
  );
};

export default ContextProvider;
