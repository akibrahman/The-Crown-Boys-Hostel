import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

const ManagerProfileComponent = ({ user }) => {
  return user.role === "manager" && !user.isManagerVerified ? (
    <div className="flex items-center justify-center pl-6 py-2">
      <p className="font-semibold shadow-xl shadow-blue-500 px-8 select-none py-2 rounded-full w-max">
        Wait till Owner accepts you!
      </p>
    </div>
  ) : (
    user.role === "manager" && user.isVerified && user.isManagerVerified && (
      <div className={`mt-10 py-8 flex flex-col items-center`}>
        <Image
          alt={`Profile picture of ${user.username}`}
          src={user.profilePicture}
          width={200}
          height={200}
          className="mb-5 rounded-full aspect-square"
        />
        <p className="mb-1 text-blue-500 font-medium text-xl">
          {user.username}
        </p>
        <p className="mb-1 text-blue-500 font-medium">
          {convertCamelCaseToCapitalized(user.role)}
        </p>
        {user.isVerified ? (
          <div className="flex flex-col md:flex-row items-center gap-3">
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
        <p>{user.email}</p>
        <p>{user.contactNumber}</p>
      </div>
    )
  );
};

export default ManagerProfileComponent;
