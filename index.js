const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5050;

// middleware
app.use(cors());
app.use(express.json());

// verify jwt
const verifyJWT = (req, res, next) => {
  const authentication = req.headers.authentication;
  if (!authentication) {
    return res
      .status(401)
      .send({ error: true, message: "UnAuthorized Access" });
  }
  const token = authentication.split(" ")[1];
  jwt.verify(token, process.env.JWT_SIGNATURE, (err, decode) => {
    if (err) {
      return res
        .status(403)
        .send({ error: true, message: "UnAuthorized Access" });
    }
    req.decoded = decode;
    next();
  });
};
// const verifyJwt = (req, res, next) => {
//   const authorization = req.headers.authorization;
//   if (!authorization) {
//     return res
//       .status(401)
//       .send({ error: true, message: "Authorization required" });
//   }
//   const token = authorization.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN, (error, decode) => {
//     if (error) {
//       return res
//         .status(403)
//         .send({ error: true, message: "Token verification failed" });
//     }
//     req.decoded = decode;
//     next();
//   });
// };

app.get("/", (req, res) => {
  res.send("Doctor is running!");
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

    // db name
    const carDoctorDB = client.db("carDoctorDB");
    // db collection
    const serviceCollection = carDoctorDB.collection("services");
    const serviceAppointment = carDoctorDB.collection("appointment");

    // jwt-operations
    app.post("/jwt", (req, res) => {
      const payLoad = req.body;
      const token = jwt.sign(payLoad, process.env.JWT_SIGNATURE, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // SERVICE
    // get services data from db
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //get single service data from db
    app.get("/services/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: new ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // service appointment operation

    // send appointInfo to db
    app.post("/appointment", async (req, res) => {
      const appointInfo = req.body;
      const result = await serviceAppointment.insertOne(appointInfo);
      res.send(result);
    });

    // get appointInfo by user uid
    app.get("/appointment", verifyJWT, async (req, res) => {
      const decodedInfo = req.decoded;
      if (decodedInfo.uid !== req.query?.uid) {
        return res
          .status(403)
          .send({ error: true, message: "Forbidden Access" });
      }
      // const decodedInfo = req.decoded;
      // if (decodedInfo.uid !== req.query?.uid) {
      //   return res
      //     .status(403)
      //     .send({ error: true, message: "Forbidden Access" });
      // }
      let query = {};
      if (req.query?.uid) {
        query = { user_id: req.query?.uid };
      }
      const appointInfo = await serviceAppointment.find(query).toArray();
      res.send(appointInfo);
    });

    // update appointment
    app.patch("/appointment/:_id", async (req, res) => {
      const id = req.params._id;
      const statusUpdate = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedInfo = {
        $set: {
          status: statusUpdate.status,
        },
      };
      const result = await serviceAppointment.updateOne(filter, updatedInfo);
      res.send(result);
    });

    // delete appointment
    app.delete("/appointment/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceAppointment.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
