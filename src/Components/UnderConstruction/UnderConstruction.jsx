import Image from "next/image";
import React from "react";

const UnderConstruction = () => {
  return (
    <div className="flex items-center justify-center min-h-full text-white bg-dashboard">
      <div className="text-center">
        <Image
          src="https://i.ibb.co/K5zZ6Cn/download-removebg-preview-1.png"
          alt="Under Construction"
          className="mx-auto mb-1"
          height={500}
          width={500}
        />
        <h1 className="text-4xl font-bold mb-4">
          Page Under Construction
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We are working hard to bring you this page. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;
