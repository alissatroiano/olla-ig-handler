const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const MindsDB = require("mindsdb-js-sdk");
dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 8080;
const serverless = require('serverless-http');

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
const router = express.Router();
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

app.set("trust proxy", 1);

// Base route
router.get("/", function (req, res) {
  return res.json("Hello world!");
});

// Text summarisation route
router.post("/reply", async function (req, res) {
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
router.listen(PORT, () => {
  console.log(`Listening at Port ${PORT}`);
});

module.exports = app;
module.exports.handler = serverless(app);
