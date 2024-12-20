"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Marquee from "react-fast-marquee";
import { FaTimes } from "react-icons/fa";

const Page = () => {
  const photos = [
    "/images/room/a1.jpeg",
    "/images/room/a2.jpeg",
    "/images/room/a3.jpeg",
    "/images/room/b1.jpeg",
    "/images/room/b2.jpeg",
    "/images/room/b3.jpeg",
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };
  // "dev": "next dev --experimental-https",
  //Page Token From Developers.facebook.com == EAAFMh9dNl8sBOwtGZAuZBuNxFt1giH9v3WKrrGkp1eReSsEANpJLKZBjVc8cKV5V380W1rGQXxxIFSf2x7107fN5ertl5LWtIfOUtFrHFzlbu09x3XkdLAyEK7MmajoaB9ZCs69Ej8o6fZAkTSaikpxAKlxwpPzbBM8yAXCW893PkemBGuzSP53GtmdkcXkSa
  return (
    <div className="relative z-10 min-h-screen pb-20 bg-dashboard text-stone-300">
      <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
        <svg
          width="450"
          height="556"
          viewBox="0 0 450 556"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="277" cy="63" r="225" fill="url(#paint0_linear_25:217)" />
          <circle
            cx="17.9997"
            cy="182"
            r="18"
            fill="url(#paint1_radial_25:217)"
          />
          <circle
            cx="76.9997"
            cy="288"
            r="34"
            fill="url(#paint2_radial_25:217)"
          />
          <circle
            cx="325.486"
            cy="302.87"
            r="180"
            transform="rotate(-37.6852 325.486 302.87)"
            fill="url(#paint3_linear_25:217)"
          />
          <circle
            opacity="0.8"
            cx="184.521"
            cy="315.521"
            r="132.862"
            transform="rotate(114.874 184.521 315.521)"
            stroke="url(#paint4_linear_25:217)"
          />
          <circle
            opacity="0.8"
            cx="356"
            cy="290"
            r="179.5"
            transform="rotate(-30 356 290)"
            stroke="url(#paint5_linear_25:217)"
          />
          <circle
            opacity="0.8"
            cx="191.659"
            cy="302.659"
            r="133.362"
            transform="rotate(133.319 191.659 302.659)"
            fill="url(#paint6_linear_25:217)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_25:217"
              x1="-54.5003"
              y1="-178"
              x2="222"
              y2="288"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <radialGradient
              id="paint1_radial_25:217"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
            >
              <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
            </radialGradient>
            <radialGradient
              id="paint2_radial_25:217"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
            >
              <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
            </radialGradient>
            <linearGradient
              id="paint3_linear_25:217"
              x1="226.775"
              y1="-66.1548"
              x2="292.157"
              y2="351.421"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_25:217"
              x1="184.521"
              y1="182.159"
              x2="184.521"
              y2="448.882"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint5_linear_25:217"
              x1="356"
              y1="110"
              x2="356"
              y2="470"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint6_linear_25:217"
              x1="118.524"
              y1="29.2497"
              x2="166.965"
              y2="338.63"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
        <svg
          width="364"
          height="201"
          viewBox="0 0 364 201"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
            stroke="url(#paint0_linear_25:218)"
          />
          <path
            d="M-22.1107 72.3303C5.65989 66.4798 73.3965 64.9086 122.178 105.427C183.155 156.076 201.59 162.093 236.333 166.607C271.076 171.12 309.718 183.657 334.889 212.24"
            stroke="url(#paint1_linear_25:218)"
          />
          <path
            d="M-53.1107 72.3303C-25.3401 66.4798 42.3965 64.9086 91.1783 105.427C152.155 156.076 170.59 162.093 205.333 166.607C240.076 171.12 278.718 183.657 303.889 212.24"
            stroke="url(#paint2_linear_25:218)"
          />
          <path
            d="M-98.1618 65.0889C-68.1416 60.0601 4.73364 60.4882 56.0734 102.431C120.248 154.86 139.905 161.419 177.137 166.956C214.37 172.493 255.575 186.165 281.856 215.481"
            stroke="url(#paint3_linear_25:218)"
          />
          <circle
            opacity="0.8"
            cx="214.505"
            cy="60.5054"
            r="49.7205"
            transform="rotate(-13.421 214.505 60.5054)"
            stroke="url(#paint4_linear_25:218)"
          />
          <circle cx="220" cy="63" r="43" fill="url(#paint5_radial_25:218)" />
          <defs>
            <linearGradient
              id="paint0_linear_25:218"
              x1="184.389"
              y1="69.2405"
              x2="184.389"
              y2="212.24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_25:218"
              x1="156.389"
              y1="69.2405"
              x2="156.389"
              y2="212.24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_25:218"
              x1="125.389"
              y1="69.2405"
              x2="125.389"
              y2="212.24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_25:218"
              x1="93.8507"
              y1="67.2674"
              x2="89.9278"
              y2="210.214"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_25:218"
              x1="214.505"
              y1="10.2849"
              x2="212.684"
              y2="99.5816"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <radialGradient
              id="paint5_radial_25:218"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(220 63) rotate(90) scale(43)"
            >
              <stop offset="0.145833" stopColor="white" stopOpacity="0" />
              <stop offset="1" stopColor="white" stopOpacity="0.08" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dashboard bg-opacity-75">
          <div className="relative">
            <Image
              src={selectedImage}
              alt="Selected document"
              height={600}
              width={400}
              className="rounded-md"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-xl bg-red-600 px-2 py-1 rounded-full aspect-square"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-2 pt-4 md:pr-14">
        <Image
          src="/images/aboutUsBanner.png"
          alt="About page banner picture"
          height={300}
          width={800}
          className=""
        />
        <Image
          src="/doc/trade.jpg"
          alt="Trade Licence of The Crown Boys Hostel"
          height={300}
          width={160}
          className="cursor-pointer rounded-md w-[120px] md:w-[160px]"
          onClick={() => handleImageClick("/doc/trade.jpg")}
        />
        <Image
          src="/doc/tin.jpg"
          alt="TIN Certificate of The Crown Boys Hostel"
          height={300}
          width={160}
          className="cursor-pointer rounded-md w-[120px] md:w-[160px]"
          onClick={() => handleImageClick("/doc/tin.jpg")}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-3 items-center justify-center pt-4">
        <motion.div
          initial={false}
          animate={{ x: 0 }}
          transition={{ type: "spring" }}
          className="flex flex-col md:flex-row items-center justify-center gap-3"
        >
          <p className="md:font-medium underline">
            বুকিং এর জন্যে পাশের বাটনে ক্লিক করে কল করুনঃ
          </p>
          <a
            href="tel:8801788422002"
            className="duration-300 px-3 py-1 bg-green-600 text-white font-medium active:scale-90 cursor-pointer select-none inline-block w-max"
          >
            Call Us
          </a>
        </motion.div>
        <p>অথবা, ডায়াল করুন -- 01788422002</p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-8">
        <p className="md:font-medium underline text-center px-4">
          রুম সম্পর্কে বিস্তারিত জানতে অথবা বুকিং এর জন্যে পাশের বাটনে ক্লিক
          করুনঃ
        </p>
        <Link href={"/rooms"}>
          <button className="duration-300 px-3 py-1 bg-green-600 text-white font-medium active:scale-90 cursor-pointer select-none inline-block w-max">
            Book now
          </button>
        </Link>
      </div>
      <div className="w-[95%] md:w-[80%] mx-auto flex flex-col md:flex-row gap-10 mt-10">
        <Image
          src="/images/aboutUsPoster.png"
          alt="About page poster picture"
          height={100}
          width={400}
          className="w-[300px] md:w-[400px] mx-auto"
        />
        <p className="text-justify text-[#c7cecf] leading-7 md:leading-9 px-4 md:px-0">
          <span className="text-5xl">ঢা</span>কার উত্তরা-১০ কামারপাড়া রোড-১৬ এ
          অবস্থিত &quot;দ্যা ক্রাউন বয়েজ হোস্টেল&quot; মেসের অত্যন্ত আদরণীয়
          পরিবেশে আপনাকে স্বাগতম। মেসটির পরিবেশ প্রাকৃতিক আলো এবং বাতাসে
          পরিপূর্ণ। মেসের সবচেয়ে গুরুত্বপূর্ণ অসাধারণ সুবিধা গুলো হলো জেনারেটর,
          নিজস্ব সাবমার্সিবল পাম্প, লিফট, এবং নিজস্ব দক্ষ বাবুর্চি যা নিশ্চিত
          করবে খাবারের সর্বোচ্চ মান। এছাড়াও, গ্রাউন্ড ফ্লোরে এক্সক্লুসিভ ওয়েটিং
          এরিয়া। এই মেসটি বিশেষভাবে আইইউবিএটি ছাত্র-ছাত্রীদের জন্য প্রতিষ্ঠিত
          হয়েছে। মেসের অভ্যন্তরীণ পরিবেশ খুবই মনোমুগ্ধকর, যা ছাত্র-ছাত্রীদের
          পছন্দের প্রতিচ্ছবি। পরিবেশটি যথায়ত সজ্জিত হয়েছে যাতে পড়াশোনা করতে
          এবং সৃজনশীল হতে ছাত্র-ছাত্রীদের সহায়ক হিসেবে কাজ করে। এছাড়াও,
          ছাত্র-ছাত্রীদের মানুষিক শান্তি ও সুরক্ষার কথা মাথায় রেখে যথাযথ
          ব্যাবস্থা নেওা হয়েছে। মেসের পরিবেশ সুরক্ষিত এবং পরিষ্কার রাখা হয়
          প্রতিনিয়ত, যাতে ছাত্র-ছাত্রীরা নিরাপদে ও স্বাস্থ্যবান ভাবে অধ্যয়ন
          করতে পারেন। এছাড়াও, মেসে সকলের জন্য প্রয়োজনীয় সুবিধা সরবরাহ করা
          হয়েছে যাতে তারা নিখুঁত ও সুবিধাজনক মানের সরঞ্জাম অনুভব করতে পারেন।
        </p>
      </div>
      <div className="py-7 w-[95%] md:w-[80%] mx-auto flex flex-col items-center justify-cente">
        <p className="mb-8 text-xl underline text-center">
          মেস এবং মেসের ওয়েবসাইট ব্যাবহারের সম্পুর্ণ গাইডলাইন ভিডিও এবং গুগল
          লোকেশন
        </p>
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4">
          <iframe
            className="w-[400px] h-[225px] md:w-[50%] md:h-[315px]"
            // width="400"
            // height="315"
            // src="https://www.youtube.com/embed/dbt8qhV2m40?si=Zzsq6oGLJI2hHJdR"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10318.026380387855!2d90.37922014003685!3d23.890568612945046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c50029e3d6a9%3A0xb3fab592c2f157d9!2sThe%20Crown%20Boys%20Hostel!5e0!3m2!1sen!2sbd!4v1714991040841!5m2!1sen!2sbd"
            // width="600"
            // height="450"
            className="w-[400px] h-[225px] md:w-[50%] md:h-[315px] border-none"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>{" "}
      <div className="py-7 w-[95%] md:w-[80%] mx-auto">
        <Marquee pauseOnHover={true}>
          {photos.map((photo, i) => (
            <Image
              key={i}
              src={photo}
              alt="About page banner picture"
              height={100}
              width={300}
              className="mx-auto w-[230px] md:w-[230px] rounded-md ml-4"
            />
          ))}
        </Marquee>
      </div>
      <div className="w-[95%] md:w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <p className="font-medium underline text-xl text-center">
            মেসের তথ্যঃ
          </p>
        </div>
        <div className="w-full">
          <p className="font-medium underline text-xl text-center">
            স্পেসিয়াল ফিচার্সঃ
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
