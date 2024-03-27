const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const MindsDB = require("mindsdb-js-sdk");
dotenv.config({ path: ".env" });
const path = require("path");
const PORT = process.env.PORT || 3000;
const buildPath = path.join(__dirname, "build");
const rateLimit = require('express-rate-limit');

const user = {
  user: process.env.MINDSDB_USER,
  password: process.env.MINDSDB_PASS,
};
const connectToMindsDB = async (user) => {
  await MindsDB.default.connect(user);
  console.log("Connected!");
};
connectToMindsDB(user);

// Express API setup
const app = express();
app.use(express.static("build"));

const getReplyData = async (comment) => {
  const model = await MindsDB.default.Models.getModel("olla", "mindsdb");

  const queryOptions = {
    where: [`comment = "${comment}"`],
  };

  const prediction = await model.query(queryOptions);
  return prediction;
};

app.use(
  cors({
    origin: "*",
  })
);
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin: *",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization"
  );
  next();
});
app.use(express.static(buildPath));
// gets the static files from the build folder
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 60, // 60 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

app.use("/reply", limiter); 
// Your existing route handler
app.post("/reply", async function (req, res) {
  let comment = req.body.comment;
  console.log(comment);
  try {
    await connectToMindsDB(user);
    let replyText = await getReplyData(comment);
    let retValue = replyText["data"]["reply"];
    res.json({ reply: retValue });
    console.log(retValue);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.json(error);
  }
});

// Run the API
app.listen(PORT, () => {
  console.log(`Listening at Port ${PORT}`);
});

module.exports = app;