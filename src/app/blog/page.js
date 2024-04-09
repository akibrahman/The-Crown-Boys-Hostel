import { getBlogs } from "@/lib/blogs";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "This is blog page",
};

const page = async () => {
  const blogs = await getBlogs();
  return (
    <div>
      <p className="text-2xl text-center text-sky-500 border py-2 rounded-md border-sky-500">
        Blogs
      </p>
      <div className="mt-5 grid grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.id}`}>
            <div className="border rounded-md border-sky-500 p-3 flex flex-col items-center gap-4">
              <Image
                className="rounded-md"
                src={blog.url}
                alt={blog.title}
                width="600"
                height="600"
              ></Image>

              <p> {blog.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
