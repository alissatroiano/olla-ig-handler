const express = require("express");
const MindsDB = require("mindsdb-js-sdk").default;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const user = {
  username: process.env.REACT_APP_MINDSDB_USERNAME,
  password: process.env.REACT_APP_MINDSDB_PASSWORD,
};

// Connect to MindsDB
const connectToMindsDB = async (user) => {
  try {
    await MindsDB.default.connect(user);
    console.log("Connected to MindsDB successfully");
  } catch (error) {
    console.error("Failed to connect to MindsDB:", error);
  }
};

const getReplyText = async (text) => {
	const model = await MindsDB.default.Model.getModel(
		"olla",
		"mindsdb"
	);

	const queryOptions = {
		where: [`comment = "${text}"`],
	};

	const prediction = await model.query(queryOptions);
	return prediction;
};

// Middleware
const app = express();
app.use(cors(({
  origin: "*"
})));

app.use(
bodyParser.urlencoded({
  extended: true,
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

// Reply route
app.post("/reply", async function (req, res) {
  let text = req.body.text;
  console.log("Request received by MindsDB endpoint");
  try {
    await connectToMindsDB(user);
    console.log("Connected to MindsDB successfully");
    let replyMsg = await getReplyText(text);
    console.log("Reply received from MindsDB:", replyMsg);
    let retValue = replyMsg["data"]["reply"];
    res.json({ reply: retValue });
  } catch (error) {
    console.log("Error occurred:", error);
    res.json(error);
  }
});

// Express
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;