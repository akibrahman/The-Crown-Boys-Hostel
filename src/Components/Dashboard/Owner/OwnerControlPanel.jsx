import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";

const OwnerControlPanel = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="bg-dashboard w-full min-h-full p-10 flex items-center justify-center gap-4 flex-wrap">
      <button
        disabled
        onClick={async () => {
          const { data } = await axios.get("/api/cronjob/cronjob", {
            headers: { Authorization: "Bearer 1234567890" },
          });
          if (data.success) {
            console.log(data.data);
            toast.success("Job Done");
          } else toast.error("Job Error");
        }}
        className="bg-sky-500 text-white px-4 py-2 rounded-full font-semibold duration-300 active:scale-90 "
      >
        Cron Job
      </button>
      <button
        disabled
        className="bg-sky-500 text-white px-4 py-2 rounded-full font-semibold duration-300 active:scale-90 "
        onClick={async () => {
          setIsLoading(true);
          const { data } = await axios.post("/api/orders/testapi");
          if (data.success) toast.success("Completed");
          setIsLoading(false);
        }}
      >
        User Data Delete{" "}
        {isLoading && <CgSpinner className="text-xl animate-spin" />}
      </button>
      <button
        disabled
        className="bg-sky-500 text-white px-4 py-2 rounded-full font-semibold duration-300 active:scale-90 flex items-center gap-3"
        onClick={async () => {
          try {
            setIsLoading(true);
            toast.success("Clicked");
            const { data } = await axios.post("/api/bills/getbills2");
            if (data.success) toast.success("Completed");
            else toast.error("Error");
            setIsLoading(false);
          } catch (error) {
            console.log(error);
            toast.error(error.response.data.msg);
            setIsLoading(false);
          }
        }}
      >
        Test
        {isLoading && <CgSpinner className="text-xl animate-spin" />}
      </button>
    </div>
  );
};

export default OwnerControlPanel;
