"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import UnderConstruction from "@/Components/UnderConstruction/UnderConstruction";

const ManagerEmailsComponent = ({ user }) => {
  if (!user) return <PreLoader />;
  if (user?.success == false) return route.push("/signin");
  if (user.role != "manager") return route.push("/");
  return (
    <div className="min-h-full p-10 bg-dashboard text-slate-100">
      {/* <iframe src="https://mail.zoho.com/zm/#mail/folder/inbox"></iframe> */}
      <UnderConstruction />
    </div>
  );
};

export default ManagerEmailsComponent;
