import axios from "axios";

export const getBlogs = async () => {
  const data = await axios.get(
    "https://jsonplaceholder.typicode.com/photos?_limit=10"
  );
  return data.data;
};

export const getBlog = async (id) => {
  console.log("===================================");
  const data = await axios.get(
    `https://jsonplaceholder.typicode.com/photos/${id}`
  );
  console.log("===================================");
  // console.log("=>>>", data);
  return data.data;
};
