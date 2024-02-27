const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const MindsDB = require("mindsdb-js-sdk");
dotenv.config({ path: '.env' });

const user = {
  user: process.env.MINDSDB_USERNAME,
  password: process.env.MINDSDB_PASSWORD,
};

const connectToMindsDB = async (user) => {
  await MindsDB.default.connect(user);
  console.log('Connected!');
};

const getReplyData = async (text) => {
	const model = await MindsDB.default.Models.getModel(
		"olla",
		"mindsdb"
	);

	const queryOptions = {
		where: [`comment = "Hey girl. I think you are so cool! Please be my friend"`],
	};

	const prediction = await model.query(queryOptions);
	return prediction;
};

// Express API setup
const app = express();
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

// Base route
app.get("/", function (req, res) {
  return res.json("Hello world!");
});

// Text summarisation route
app.post("/reply", async function (req, res) {
  let text = req.body.text;
  try {
    await connectToMindsDB(user);
    let replyText = await getReplyData(text);
    let retValue = replyText["data"]["reply"];
    res.json({ reply: retValue });
    console.log(retValue);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.json(error);
  }
});

// Run the API
const port = 8080;
app.listen(port, () => {
  console.log(`Listening at Port ${port}`);
});

module.exports = app;
