import mongoose from "mongoose";

export const dbConfig = async () => {
  try {
    await mongoose.connect(
      // process.env.MONGO_URI,
      "mongodb://localhost:27017",
      { dbName: "HostelPlatesDB" }
    );
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB Connected Successfully");
    });
    connection.on("error", (err) => {
      console.log("MongoDB Connection Error");
      console.log(err);
    });
  } catch (err) {
    console.log("Error to connect to the DB");
    console.log(err);
  }
};
