const express = require("express");
const cors = require("cors");

const adminRoute = require("./admin");
const mainRoute = require("./mainRoute");
const app = express();
const port = process.env.PORT || 5050;

// middleware
app.use(cors());
app.use(express.json());

// different router
app.use("/admin", adminRoute);
app.use("/", mainRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
