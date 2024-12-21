"use client";

import { useState } from "react";
import SectionTitle from "./coms/SectionTitle";
import PricingBox from "./coms/PricingBox";
import OfferList from "./coms/OfferList";
import Link from "next/link";

const Pricing = () => {
  const [isNonAC, setIsNonAC] = useState(true);

  return (
    <section
      id="pricing"
      className="relative bg-dark-black flex items-center justify-center z-10 py-6 md:py-8 lg:py-10"
    >
      <div className="container">
        <SectionTitle
          title="Simple and Affordable Pricing"
          paragraph="The Crown Boys Hostel offers a straightforward pricing plan with no hidden costs. Experience comfort and convenience starting at just 3000 BDT per month with a one-time service charge of 1500 BDT."
          center
          width="665px"
        />

        <div className="w-full">
          <div
            className="wow fadeInUp mb-8 flex justify-center md:mb-12 lg:mb-16"
            data-wow-delay=".1s"
          >
            <span
              onClick={() => setIsNonAC(true)}
              className={`${
                isNonAC
                  ? "pointer-events-none text-primary"
                  : "text-dark dark:text-white"
              } mr-4 cursor-pointer text-base font-semibold`}
            >
              Non-AC
            </span>
            <div
              onClick={() => setIsNonAC(!isNonAC)}
              className="flex cursor-pointer items-center"
            >
              <div className="relative">
                <div className="h-5 w-14 rounded-full bg-[#1D2144] shadow-inner"></div>
                <div
                  className={`${
                    isNonAC ? "" : "translate-x-full"
                  } shadow-switch-1 absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center rounded-full bg-primary transition`}
                >
                  <span className="active h-4 w-4 rounded-full bg-white"></span>
                </div>
              </div>
            </div>
            <span
              onClick={() => setIsNonAC(false)}
              className={`${
                isNonAC
                  ? "text-dark dark:text-white"
                  : "pointer-events-none text-primary"
              } ml-4 cursor-pointer text-base font-semibold`}
            >
              AC
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          <PricingBox
            packageName="2 Seat Room"
            price={isNonAC ? "4999" : "19999"}
            // duration={isNonAC ? "Non-AC" : "AC"}
            duration={"Seat"}
            subtitle="A cozy shared room, perfect for two residents with essential amenities."
          >
            {!isNonAC && (
              <OfferList text="All Expenses Included" status="active" />
            )}
            <OfferList text="Daily Cleaning Service" status="active" />
            <OfferList text="High-Speed WiFi" status="active" />
            <OfferList text="Access to Study Room" status="active" />
            <OfferList text="Electricity and Water Included" status="active" />
            <OfferList text="Laundry Service" status="active" />
            <OfferList text="Free Maintenance Support" status="active" />
          </PricingBox>

          <PricingBox
            packageName="3 Seat Room"
            price={isNonAC ? "4499" : "14999"}
            // duration={isNonAC ? "Non-AC" : "AC"}
            duration={"Seat"}
            subtitle="An ideal room for three individuals, combining comfort and community living."
          >
            {!isNonAC && (
              <OfferList text="All Expenses Included" status="active" />
            )}
            <OfferList text="Daily Cleaning Service" status="active" />
            <OfferList text="High-Speed WiFi" status="active" />
            <OfferList text="Access to Study Room" status="active" />
            <OfferList text="Electricity and Water Included" status="active" />
            <OfferList text="Laundry Service" status="active" />
            <OfferList text="Free Maintenance Support" status="active" />
          </PricingBox>

          <PricingBox
            packageName="4 Seat Room"
            price={isNonAC ? "3999" : "9999"}
            // duration={isNonAC ? "Non-AC" : "AC"}
            duration={"Seat"}
            subtitle="A budget-friendly option for groups of four, ensuring essential services."
          >
            {!isNonAC && (
              <OfferList text="All Expenses Included" status="active" />
            )}
            <OfferList text="Daily Cleaning Service" status="active" />
            <OfferList text="High-Speed WiFi" status="active" />
            <OfferList text="Access to Study Room" status="active" />
            <OfferList text="Electricity and Water Included" status="active" />
            <OfferList text="Laundry Service" status="active" />
            <OfferList text="Free Maintenance Support" status="active" />
          </PricingBox>
        </div>

        <Link
          href={"/rooms"}
          className="flex w-[80%] md:w-[50%] mx-auto mt-2 md:mt-4 items-center justify-center rounded-sm bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
        >
          Details
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Pricing;
