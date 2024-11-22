import SectionTitle from "./coms/SectionTitle";
import SingleBlog from "./coms/SingleBlog";
import blogData from "./data/blogData";

const Blog = () => {
  return (
    <section
      id="blog"
      className="bg-bg-color-dark flex items-center justify-center py-6 md:py-8 lg:py-10"
    >
      <div className="container">
        <SectionTitle
          title="Our Latest Blogs"
          paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {blogData.map((blog) => (
            <div key={blog.id} className="w-full">
              <SingleBlog blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
