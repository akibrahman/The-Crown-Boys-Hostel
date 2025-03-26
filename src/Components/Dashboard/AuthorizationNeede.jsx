import React from "react";
import BubbleFloating from "../BubbleFloating/BubbleFloating";
import Tag from "../Tag/Tag";

const AuthorizationNeede = () => {
  return (
    <div className="relative min-h-full bg-dashboard -z-10 text-slate-100 font-medium">
      <BubbleFloating />
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
        <p className="text-center">Please wait</p>
        <p className="text-center">Your request is being Verified</p>
        <p className="text-center">
          One of our representive will accept you soon
        </p>
      </div>
      <div className="absolute bottom-5 left-[98%] -translate-x-full flex flex-col items-center">
        <Tag />
      </div>
    </div>
  );
};

export default AuthorizationNeede;
