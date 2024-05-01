import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaArrowRight } from "react-icons/fa";

const ManagerSettings = ({ user }) => {
  return user.role === "manager" &&
    user.isVerified &&
    user.isManagerVerified ? (
    <div className="px-3 my-auto relative flex items-center justify-center">
      <div className="flex flex-col items-center justify-center flex-wrap gap-5">
        <Link href="/orderStatus" className="group">
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[200px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            Order Status
          </button>
        </Link>
        <Link href={"/billQuery"}>
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[200px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            Bill Query
          </button>
        </Link>
        <Link href="/userQuery">
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[200px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            User Query
          </button>
        </Link>
        <Link href="/marketQuery">
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[200px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            Market Query
          </button>
        </Link>
        <Link href="/managerOrder">
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[200px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            Meal Updator
          </button>
        </Link>
        <button
          onClick={async () => {
            const { data } = await axios.get("/api/cronjob/createorders");
            if (data.success) toast.success("Cron Job Done");
            else toast.error("Cron Job Error");
          }}
          className="bg-sky-500 text-white px-4 py-2 rounded-full font-semibold duration-300 active:scale-90 hidden"
        >
          Cron Job
        </button>
      </div>
    </div>
  ) : user.role === "manager" && !user.isVerified ? (
    <div className="h-[380px] border-l-4 border-blue-500 overflow-y-scroll px-3 flex items-center justify-center gap-4 mt-10 relative">
      <p>Verify Email</p>
    </div>
  ) : (
    user.role === "manager" &&
    !user.isManagerVerified && (
      <div className="col-span-2 h-[380px] border-l-4 border-blue-500 overflow-y-scroll px-3 flex items-center justify-center gap-4 mt-10 relative">
        <p>Verify as a manager</p>
      </div>
    )
  );
};

export default ManagerSettings;
