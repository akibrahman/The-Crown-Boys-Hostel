import Image from "next/image";
import React from "react";

const UnderConstruction = () => {
  return (
    <div className="flex items-center justify-center min-h-full text-white bg-dashboard">
      <div className="text-center">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/the-crown-boys-hostel.appspot.com/o/others%2Fpage-under-construction.jpg?alt=media&token=98bd41dc-e3e5-4526-9ad9-8f073991d9fb"
          alt="Under Construction"
          className="mx-auto mb-1 aspect-video rounded-md"
          height={500}
          width={500}
        />
        <h1 className="text-4xl font-bold mb-4">Page Under Construction</h1>
        <p className="text-lg text-gray-600 mb-8">
          We are working hard to bring you this page. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;
