import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { motion } from "framer-motion";

const ClientProfile = ({ user }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center min-h-full px-20 md:px-32 py-5 bg-dashboard text-slate-100 overflow-x-hidden">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className={`w-full md:w-1/2 flex flex-col items-center relative`}
      >
        <Image
          alt={`Profile picture of ${user.username}`}
          src={user.profilePicture}
          width={200}
          height={200}
          className="mb-5 rounded-full aspect-square"
        />
        <p className="mb-1 text-blue-500 font-medium text-xl text-center w-max">
          {user.username}
        </p>
        <p>{user.email}</p>
        <p>Role: {convertCamelCaseToCapitalized(user.role)}</p>

        {user.isVerified ? (
          <div className="flex flex-col md:flex-row items-center gap-3 mt-2">
            {" "}
            <p
              className={`flex items-center gap-1 w-max px-4 py-1 rounded-full font-semibold ${
                user.role === "owner" ? "text-blue-500" : "text-green-500"
              }`}
            >
              <TiTick className="text-xl" />
              Verified
            </p>
          </div>
        ) : (
          <p
            className={`flex items-center gap-1 w-max px-4 py-1 rounded-full font-semibold mt-2 bg-red-500 select-none`}
          >
            <FaTimes className="text-xl" />
            Unverified
          </p>
        )}
      </motion.div>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="w-full md:w-1/2"
      >
        <div className="flex items-center justify-center gap-4">
          <p class="text-center tracking-wide text-white font-bold">Charges</p>
        </div>
        {user.charges.length == 0 && (
          <p className="text-center text-sm my-2 select-none">
            No Added Charges
          </p>
        )}
        {user.charges.length != 0 && (
          <table className="w-[90%] mx-auto yt-2">
            <thead className="bg-[rgba(0,0,200,0.2)]">
              <tr>
                <td className="border text-center py-1.5">Note</td>
                <td className="border text-center py-1.5">Amount</td>
              </tr>
            </thead>
            {user.charges.map((crg, i) => (
              <tbody key={i} className="text-sm">
                <tr>
                  <td className="border text-center py-1">{crg.note}</td>
                  <td className="border text-center py-1">{crg.amount}</td>
                </tr>
              </tbody>
            ))}
          </table>
        )}
        <div className="flex items-center justify-center gap-4">
          <p class="text-center tracking-wide text-white font-bold">
            Block Date
          </p>
        </div>
        {user.blockDate ? (
          <p className="text-center text-sm my-2 text-red-500 select-none">
            {new Date(user.blockDate).toDateString()}
          </p>
        ) : (
          <p className="text-center text-sm my-2 text-green-500 select-none">
            You are not scheduled to be Blocked
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default ClientProfile;
