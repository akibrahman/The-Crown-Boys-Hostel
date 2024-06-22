"use client";

import Image from "next/image";

const Home = () => {
  return (
    <div className="px-10 bg-dashboard">
      <div className="flex flex-col md:flex-row gap-10 items-center md:justify-between py-10 md:h-[calc(100vh-65px)] md:min-h-screen">
        <div className="w-full md:w-1/2">
          <p className="dark:text-white text-[30px] md:text-[40px] font-semibold mb-4">
            The Crown Boys Hostel
          </p>
          <p className="w-[95%] dark:text-white">
            Enjoy the ease of having wholesome and nutritious meals delivered
            straight to your university hostel room. Our online meal service
            ensures that you do not have to compromise on quality or flavor,
            providing a convenient solution for your busy student life.
          </p>
          <p className="w-[80%] dark:text-white mt-2">
            Mijan Meal Management System
          </p>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              placeholder="Subscribe to our newsletter"
              className="dark:bg-[#282828] bg-stone-300 dark:text-white px-4 py-2 rounded-l-md focus:outline-none w-[200px] md:w-[250px] lg:w-[320px]"
            />
            <button className="bg-sky-500 text-white text-sm px-3 md:px-6 py-2.5 rounded-r-md hover:bg-sky-700 focus:outline-none">
              Subscribe
            </button>
          </div>
        </div>
        <div className="w-[95%] md:w-1/2">
          <Image
            // placeholder="blur"
            className=""
            src="/images/home-banner.png"
            height={100}
            width={500}
            alt="Banner Image"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
