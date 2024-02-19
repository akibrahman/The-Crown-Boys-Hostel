import axios from "axios";

export const imageUpload = async (image, link) => {
  try {
    const { data: api } = await axios.get("/api/others/getimgbbapi");
    if (!image) {
      return link;
    }
    const imageData = new FormData();
    imageData.append("image", image);
    const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=${api.api}`,
      imageData
    );
    return data.data.display_url;
  } catch (error) {
    console.log(error);
  }
};
