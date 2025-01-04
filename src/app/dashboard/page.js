"use client";

import { AuthContext } from "@/providers/ContextProvider";
import { useContext } from "react";
import ManagerProfile from "./ManagerProfile";
import ClientProfile from "./ClientProfile";

const Page = () => {
  const { user } = useContext(AuthContext);

  if (user.role == "manager") return <ManagerProfile user={user} />;
  else return <ClientProfile user={user} />;
};

export default Page;
