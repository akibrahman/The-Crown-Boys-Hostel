import { Bangers, Noto_Sans_Bengali } from "next/font/google";

export const metadata = {
  title: "Gallery",
  description: "This is Gallery page",
};

const fontt = Bangers({
  weight: "400",
  subsets: ["latin"],
});
const bangla = Noto_Sans_Bengali({
  weight: "400",
  subsets: ["latin"],
});

const page = () => {
  return (
    <div>
      <p>This is gallery page</p>
      <p className={`${fontt.className} mt-10`}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </p>
      <p className={bangla.className + " mt-10 text-xl"}>
        নেক্সট জে.এস. সম্পূর্ন কোর্স (বাংলায়)
      </p>
    </div>
  );
};

export default page;
