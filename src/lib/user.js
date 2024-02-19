import axios from "axios";

export const getUser = async () => {
  const { data } = await axios.get("/api/users/me");
  return data.user;
};
