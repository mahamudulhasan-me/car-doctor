const express = require("express");
const adminRoute = express.Router();
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
adminRoute.get("/", (req, res) => {
  res.send("Dashboard");
});

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.beeiwwt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const carDoctorDB = client.db("carDoctorDB");
    const featureCollection = carDoctorDB.collection("coreFeatures");

    adminRoute.post("/features", async (req, res) => {
      const features = req.body;
      const result = await featureCollection.insertOne(features);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("mondoDB connected Admin");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

module.exports = adminRoute;
