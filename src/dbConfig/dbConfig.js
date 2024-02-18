import mongoose from "mongoose";

export const dbConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "HostelPlatesDB" });
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB Connected Successfully");
    });
    connection.on("error", (err) => {
      console.log("MongoDB Connection Error");
      console.log(err);
      process.exit();
    });
  } catch (err) {
    console.log("Error to connect to the DB");
    console.log(err);
  }
};
