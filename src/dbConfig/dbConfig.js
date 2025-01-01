import mongoose from "mongoose";

let isConnected = false; // Track whether the connection is established

export const dbConfig = async () => {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return; // Skip creating a new connection if already connected
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "HostelPlatesDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true; // Mark as connected
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
