const express = require("express");
const cors = require("cors");
const port = 5000;
const app = express();
const {
  MongoClient,
  ServerApiVersion,
  serialize,
  ObjectId,
} = require("mongodb");
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://akibrahman5200:akib2542@cluster0.bfs9yhw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
app.get("/", (req, res) => {
  res.send("RFID server is Running");
});
async function run() {
  try {
    const mainCollections = client.db("HostelPlatesDB").collection("orders");
    const rfidCollections = client.db("HostelPlatesDB").collection("rfids");
    app.get("/order-finder", async (req, res) => {
      const order = await mainCollections.findOne({
        _id: new ObjectId("662120c7a3718f33828f6085"),
      });
      res.send(order);
    });
    app.post("/check-order", async (req, res) => {
      const { cardId } = await req.body;
      const ress = await rfidCollections.insertOne({
        cardId,
        createdAt: new Date().toISOString("en-US", {
          timeZone: "Asia/Dhaka",
        }),
      });
      res.send({ ...ress, success: true });
    });
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`RFID is running on port: ${port}`);
});

// #include <ESP8266WiFi.h>
// #include <ESP8266HTTPClient.h>
// #include <ArduinoJson.h>

// const char* ssid = "Akib";
// const char* password = "akib0000";

// WiFiClient client;
// HTTPClient http;

// void setup_wifi() {
//   delay(10);
//   Serial.println();
//   Serial.print("Connecting to ");
//   Serial.println(ssid);
//   WiFi.begin(ssid,password);
//   while(WiFi.status() != WL_CONNECTED) {
//     delay(500);
//     Serial.print(".");
//   }
//   Serial.println("");
//   Serial.println("Wifi Connected");
//   Serial.print("IP Address: ");
//   Serial.println(WiFi.localIP());
// }

// void connectServer() {
//   int server = 0;
//   while(server == 0)
//   {
//     Serial.println("Connecting to server");
//     String requestUrl = "http://rfid-server.glitch.me/order-finder";
//     http.begin(client,requestUrl);
//     int httpResponseCode = http.GET();
//      if(httpResponseCode == HTTP_CODE_OK) {
//       server = 1;
//       Serial.println("Connected to server");
//      }
//   }
//   return;
// }

// void getRequest() {
//   Serial.println("\n\nPerforming HTTP GET Request\n");
//     //HTTP Details
//     String requestUrl = "http://rfid-server.glitch.me/order-finder";
//     http.begin(client,requestUrl);
//     //Send HTTP GET request
//     int httpResponseCode = http.GET();
//     Serial.print("HTTP Response Code: ");
//     Serial.println(httpResponseCode);
//     if(httpResponseCode == HTTP_CODE_OK) {
//       String payload = http.getString();
//       Serial.println("Response Payload: " + payload);
//       DynamicJsonDocument doc(1024);
//       deserializeJson(doc, payload);;
//       JsonObject obj = doc.as<JsonObject>();
//       String value = obj[String("_id")];
//       Serial.println("\nId is: " + value);
//     }else{
//       Serial.print("Error code is: ");
//       Serial.println(httpResponseCode);
//     }
//     http.end();
// }

// void setup() {
//   Serial.begin(115200);
//   delay(1000);
//   Serial.println("\n\nWelcome to The Crown Boys Hostel\n");
//   setup_wifi();
//   connectServer();
// }

// void loop() {
//   if(WiFi.status() == WL_CONNECTED) {
//     // getRequest();
//   }else{
//     Serial.println("Wifi Disconnected");
//   }
//   delay(5000);
// }
