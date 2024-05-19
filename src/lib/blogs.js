import axios from "axios";

export const getClient = async (id) => {
  const { data } = await axios.get(
    `${process.env.CLIENT_SIDE}/api/clients/getclient?id=${id}`
  );
  return data.client;
};
