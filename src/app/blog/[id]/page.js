import { getBlog } from "@/lib/blogs";
import Image from "next/image";

const page = async ({ params }) => {
  const { id } = params;
  const blog = await getBlog(id);

  return (
    <div>
      <p className="text-2xl text-center text-yellow-500 border py-2 rounded-md border-yellow-500">
        Blog Details
      </p>
      <div
        className="border rounded-md border-yellow-500 p-3 flex flex-col items-center gap-4"
        key={blog.albumId}
      >
        <Image
          // placeholder="blur"
          className="rounded-md"
          src={blog.thumbnailUrl}
          alt={blog.title}
          width="150"
          height="150"
        ></Image>
        <Image
          // placeholder="blur"
          className="rounded-md"
          src={blog.url}
          alt={blog.title}
          width="600"
          height="600"
        ></Image>

        <p> {blog.title}</p>
      </div>
    </div>
  );
};

export default page;
