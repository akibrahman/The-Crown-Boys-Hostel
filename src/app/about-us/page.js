"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";

const page = () => {
  const photos = [
    "/images/room/1.jpg",
    "/images/room/2.jpg",
    "/images/room/3.jpg",
    "/images/room/4.jpg",
    "/images/room/5.jpg",
    "/images/room/6.jpg",
    "/images/room/7.jpg",
    "/images/room/8.jpg",
    "/images/room/9.jpg",
    "/images/room/10.jpg",
  ];
  //Page Token From Developers.facebook.com == EAAFMh9dNl8sBOwtGZAuZBuNxFt1giH9v3WKrrGkp1eReSsEANpJLKZBjVc8cKV5V380W1rGQXxxIFSf2x7107fN5ertl5LWtIfOUtFrHFzlbu09x3XkdLAyEK7MmajoaB9ZCs69Ej8o6fZAkTSaikpxAKlxwpPzbBM8yAXCW893PkemBGuzSP53GtmdkcXkSa
  return (
    <div className="min-h-screen pb-20 dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-gradient-to-r from-primary to-secondary dark:text-stone-300 text-stone-300">
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
      <Image
        src="/images/aboutUsBanner.png"
        alt="About page banner picture"
        height={300}
        width={800}
        className="mx-auto px-8 md:p-0 mt-5"
      />
      <div className="hidden flex-col md:flex-row items-center justify-center gap-3 mt-8">
        <p className="md:font-medium underline">
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
            src="https://www.youtube.com/embed/dbt8qhV2m40?si=Zzsq6oGLJI2hHJdR"
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

export default page;
