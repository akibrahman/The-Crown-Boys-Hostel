"use client";

import { AuthContext } from "@/providers/ContextProvider";
import { useContext } from "react";
import ClientProfileEdit from "./ClientProfileEdit";
import ManagerProfileEdit from "./ManagerProfileEdit";

const Page = () => {
  const { user } = useContext(AuthContext);
  if (user.role == "manager") return <ManagerProfileEdit user={user} />;
  else return <ClientProfileEdit user={user} />;
};

export default Page;
