const express = require("express");
const MindsDB = require("mindsdb-js-sdk");
const bodyParser = require("body-parser");
const cors = require("cors");
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
connectToMindsDB(user);

const getReplyText = async (text) => {
  const model = await MindsDB.default.Models.getModel("olla", "mindsdb");

  const queryOptions = {
    where: [`comment = "${text}"`],
  };

  const prediction = await model.query(queryOptions);
  return prediction;
};

// Middleware
const app = express();
app.use(express.json());
app.use(cors(({
  origin: "*"
})));

// Base route
app.get("/", function (req, res) {
  return res.json("Hello world!");
});

// Reply route
app.post("/reply", async function (req, res) {
  let text = req.body.text;
  try {
    await connectToMindsDB(user);
    let replyMsg = await getReplyText(text);
    let retValue = replyMsg["data"]["reply"];
    res.json({ msgReply: retValue });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
