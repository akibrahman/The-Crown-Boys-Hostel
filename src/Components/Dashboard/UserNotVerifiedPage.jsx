import React, { useState } from "react";
import { TiTick } from "react-icons/ti";
import BubbleFloating from "../BubbleFloating/BubbleFloating";
import axios from "axios";
import toast from "react-hot-toast";
import Tag from "../Tag/Tag";

const UserNotVerifiedPage = ({ user }) => {
  const [canVerify, setCanVerify] = useState(true);
  return (
    <div className="relative min-h-full bg-dashboard -z-10 text-slate-100 font-medium">
      <BubbleFloating />
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <p className="text-blue-500 font-semibold text-lg">
          Please verify your E-mail
        </p>
        {canVerify ? (
          <button
            onClick={async () => {
              setCanVerify(false);
              axios.post("/api/sendverificationemail", {
                userName: user.username,
                email: user.email,
                emailType: "verify",
                userId: user._id,
              });
              toast.success("Verification E-mail sent");
            }}
            className="flex items-center gap-1 duration-300 bg-sky-500 text-sm w-max px-6 py-1.5 rounded-full font-semibold mt-2 active:scale-90 text-white select-none cursor-pointer"
          >
            Verify
          </button>
        ) : (
          <p
            className={`flex items-center gap-1 w-max px-4 py-1 rounded-full font-semibold mt-2 bg-green-500 select-none text-white cursor-pointer`}
          >
            <TiTick className="text-xl" />
            Verification E-mail sent
          </p>
        )}
      </div>
      <div className="absolute bottom-5 left-[98%] -translate-x-full flex flex-col items-center">
        <Tag />
      </div>
    </div>
  );
};

export default UserNotVerifiedPage;
