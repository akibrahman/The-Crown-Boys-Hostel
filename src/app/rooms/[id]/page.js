import Component from "./Component.jsx";
import { dbConfig } from "@/dbConfig/dbConfig.js";
import Room from "@/models/roomModel.js";

await dbConfig();

export async function generateStaticParams() {
  try {
    const rooms = await Room.find();
    return rooms.map((room) => ({
      id: room._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching rooms data:", error);
    return [];
  }
}

const Page = ({ params }) => {
  const { id } = params;
  // return <p>{id}</p>;
  return <Component id={id} />;
};

export default Page;
