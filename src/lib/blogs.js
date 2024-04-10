import axios from "axios";

export const getBlogs = async () => {
  const data = await axios.get(
    "https://jsonplaceholder.typicode.com/photos?_limit=10"
  );
  return data.data;
};

export const getBlog = async (id) => {
  const data = await axios.get(
    `https://jsonplaceholder.typicode.com/photos/${id}`
  );
  return data.data;
};

export const getClient = async (id) => {
  const { data } = await axios.get(
    `${process.env.CLIENT_SIDE}/api/clients/getclient?id=${id}`
  );
  return data.client;
};
