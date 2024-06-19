import React, { useState } from "react";
import { TiTick } from "react-icons/ti";
import BubbleFloating from "../BubbleFloating/BubbleFloating";
import axios from "axios";
import toast from "react-hot-toast";

const UserNotVerifiedPage = ({ user }) => {
  const [canVerify, setCanVerify] = useState(true);
  return (
    <div className="h-full relative">
      <BubbleFloating />
      <div className="flex flex-col items-center justify-center gap-1 h-full">
        <p className="text-blue-500 font-semibold text-lg">Please verify your E-mail</p>
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
    </div>
  );
};

export default UserNotVerifiedPage;
