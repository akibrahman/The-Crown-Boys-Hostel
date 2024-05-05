import Image from "next/image";
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
  return (
    <div className="min-h-screen dark:bg-gradient-to-r dark:from-primary dark:to-secondary dark:text-stone-300">
      <Image
        src="/images/WebSite.png"
        alt="About page banner picture"
        height={300}
        width={1200}
        className="mx-auto"
      />
      <p className="w-[95%] md:w-[80%] mx-auto text-justify mt-4 text-[#c7cecf] leading-9">
        <span className="text-5xl">ঢা</span>কার উত্তরা-১০ কামারপাড়া রোড-১৬ এ
        অবস্থিত &quot;দ্যা ক্রাউন বয়েজ হোস্টেল&quot; মেসের অত্যন্ত আদরণীয়
        পরিবেশে আপনাকে স্বাগতম। মেসটির পরিবেশ প্রাকৃতিক আলো এবং বাতাসে পরিপূর্ণ।
        মেসের সবচেয়ে গুরুত্বপূর্ণ অসাধারণ সুবিধা গুলো হলো জেনারেটর, নিজস্ব
        সাবমার্সিবল পাম্প, লিফট, এবং নিজস্ব দক্ষ বাবুর্চি যা নিশ্চিত করবে
        খাবারের সর্বোচ্চ মান। এছাড়াও, গ্রাউন্ড ফ্লোরে এক্সক্লুসিভ অয়েটিং এরিয়া।
        এই মেসটি বিশেষভাবে আইইউবিএটি ছাত্র-ছাত্রীদের জন্য প্রতিষ্ঠিত হয়েছে।
        মেসের অভ্যন্তরীণ পরিবেশ খুবই মনোমুগ্ধকর, যা ছাত্র-ছাত্রীদের পছন্দের
        প্রতিচ্ছবি। পরিবেশটি যথায়ত সজ্জিত হয়েছে যাতে পড়াশোনা করতে এবং সৃজনশীল
        হতে ছাত্র-ছাত্রীদের সহায়ক হিসেবে কাজ করে। এছাড়াও, ছাত্র-ছাত্রীদের
        মানুষিক শান্তি ও সুরক্ষার কথা মাথায় রেখে যথাযথ ব্যাবস্থা নেওা হয়েছে।
        মেসের পরিবেশ সুরক্ষিত এবং পরিষ্কার রাখা হয় প্রতিনিয়ত, যাতে
        ছাত্র-ছাত্রীরা নিরাপদে ও স্বাস্থ্যবান ভাবে অধ্যয়ন করতে পারেন। এছাড়াও,
        মেসে সকলের জন্য প্রয়োজনীয় সুবিধা সরবরাহ করা হয়েছে যাতে তারা নিখুঁত ও
        সুবিধাজনক মানের সরঞ্জাম অনুভব করতে পারেন।
      </p>
      <div className="py-7 w-[95%] md:w-[80%] mx-auto">
        <Marquee pauseOnHover={true}>
          {photos.map((photo, i) => (
            <Image
              key={i}
              src={photo}
              alt="About page banner picture"
              height={100}
              width={300}
              className="mx-auto w-[150px] md:w-[230px] rounded-md ml-4"
            />
          ))}
        </Marquee>
      </div>
      <div className="py-7 w-[95%] md:w-[80%] mx-auto flex flex-col items-center justify-cente">
        <p className="mb-8 text-xl underline">
          মেস এবং মেসের ওয়েবসাইট ব্যাবহারের সম্পুর্ণ গাইডলাইন ভিডিও
        </p>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/dbt8qhV2m40?si=Zzsq6oGLJI2hHJdR"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  );
};

export default page;
