const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const objectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ft5t4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
   
    const database = client.db("tour");
    const serviceCollection = database.collection("offerings");

    const userdb = client.db("User");
    const userCollection = userdb.collection("user-info");

    //GET API AND LOAD DATA
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //GET SINGLE SERVICE
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const service = await serviceCollection.findOne(query);
      res.json(service);
    });

    //POST data
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.json(result);
    });

    //Post user data
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    //DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.json(result);
    });
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running geinus server");
});

app.listen(port, (req, res) => {
  console.log("running geinus server on port ", port);
});
