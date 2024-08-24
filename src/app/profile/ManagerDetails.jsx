import Image from "next/image";
import { motion } from "framer-motion";

const ManagerDetails = ({ user, manager }) => {
  return user.role === "client" && !user.isVerified ? (
    <div className="flex items-center justify-center pl-6 py-8 mt-10">
      <p className="font-semibold shadow-xl shadow-blue-500 px-8 select-none py-2 rounded-full">
        At first verify youself!
      </p>
    </div>
  ) : user.role === "client" && user.isVerified && !user.isClientVerified ? (
    <div className="flex items-center justify-center pl-6 py-8 mt-10">
      <p className="font-semibold shadow-xl shadow-blue-500 px-8 select-none py-2 rounded-full w-max">
        Wait till manager accepts you!
      </p>
    </div>
  ) : (
    user.role === "client" &&
    user.isVerified &&
    user.isClientVerified && (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className={`mt-10 py-8 flex flex-col items-center`}
      >
        <Image
          alt={`Profile picture of ${manager.username}`}
          src={manager.profilePicture}
          width={200}
          height={200}
          className="mb-10 rounded-full aspect-square"
        />
        <p className="mb-1 text-blue-500 font-medium text-xl">
          {manager.username}
        </p>
        <p>{manager.email}</p>
        <p>{manager.contactNumber}</p>
      </motion.div>
    )
  );
};

export default ManagerDetails;
