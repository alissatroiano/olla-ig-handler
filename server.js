const express = require("express");
const MindsDB = require("mindsdb-js-sdk");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const axios = require("axios");
const { query } = require("mindsdb-js-sdk");

const PORT = process.env.PORT || 3000;

const user = process.env.REACT_APP_MINDSDB_USERNAME;
console.log(user);
const password = process.env.REACT_APP_MINDSDB_PASSWORD;

// Connect to MindsDB
const connectToMindsDBCloud = async (user, password) => {
  try {
    // Create a session with MindsDB Cloud
    const session = await axios.post("https://cloud.mindsdb.com/cloud/login", {
      user,
      password,
    });

    // Return the session for further use
    return session;
  } catch (error) {
    console.error("Error connecting to MindsDB Cloud:", error);
    throw error;
  }
};

connectToMindsDBCloud(user, password)
  .then((session) => {
    console.log("Connected to MindsDB Cloud. Session:", session.data);
    // Proceed with making queries or other actions using the session
  })
  .catch((error) => {
    console.error("Error connecting to MindsDB Cloud:", error);
  });

const queryOptions = {
  name: "olla",
  project: "mindsdb",
  targetColumn: "reply",
};

const whereClause = "comment = ?";

const getReplyText = async (text) => {
  try {
    const model = await MindsDB.default.Models.getModel("olla");

    const response = await model.query({
      queryOptions: {
        name: "olla",
        project: "mindsdb",
        targetColumn: "reply",
        where: whereClause, 
      },
      params: [text],
    });

    return response.data;
  } catch (error) {
    console.error("Error getting reply text from MindsDB:", error);
    throw error;
  }
};

// Middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Base route
app.get("/", function (req, res) {
  return res.json("Hello world!");
});

// Reply route
// Reply route
app.post("/data", async function (req, res) {
  let comment = req.body.comment;
  console.log("Request queued to send to MindsDB endpoint" + comment);
  try {
    await connectToMindsDBCloud(user, password);
    console.log("Connected to MindsDB successfully");
    let replyMsg = await getReplyText(comment);
    console.log("Reply received from MindsDB:", replyMsg);
    let retValue = replyMsg["data"]["reply"];
    res.json({ reply: retValue });
  } catch (error) {
    console.log("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
