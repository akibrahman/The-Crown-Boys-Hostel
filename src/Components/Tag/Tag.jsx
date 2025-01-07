import Image from "next/image";
import React from "react";

const Tag = () => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={"/images/logo.png"}
        alt="Logo of The Crown Boys Hostel"
        height={60}
        width={60}
        className="h-[60px] w-[60px] aspect-square"
      />
      <p className="w-max text-xl">The Crown Boys Hostel</p>
      <p className="w-max text-xs">Best in the mess life</p>
      <p className="w-max text-sm">Developed by AKib Rahman</p>
    </div>
  );
};

export default Tag;
