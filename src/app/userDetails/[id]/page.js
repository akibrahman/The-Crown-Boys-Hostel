import { dbConfig } from "@/dbConfig/dbConfig.js";
import Component from "./Component.jsx";
import User from "@/models/userModel.js";

await dbConfig();

export async function generateStaticParams() {
  try {
    const clients = await User.find();
    return clients.map((client) => ({
      id: client._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching User Details data:", error);
    return [];
  }
}

const Page = ({ params }) => {
  const { id } = params;

  return <Component id={id} />;
};

export default Page;
