const express = require("express");
const MindsDB = require("mindsdb-js-sdk");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const axios = require('axios');
const PORT = process.env.PORT || 3000;

const email = process.env.REACT_APP_MINDSDB_USERNAME;
const password = process.env.REACT_APP_MINDSDB_PASSWORD;

const connectToMindsDBCloud = async (email, password) => {
  try {
    // Create a session with MindsDB Cloud
    const session = await axios.post('https://cloud.mindsdb.com/cloud/login', {
      email,
      password
    });

    // Return the session for further use
    return session;
  } catch (error) {
    console.error("Error connecting to MindsDB Cloud:", error);
    throw error;
  }
};

// Define the function to get reply text from MindsDB
const getReplyText = async (text) => {
  try {
    // Assuming you have an appropriate API endpoint for predictions
    const response = await axios.post('https://cloud.mindsdb.com/', {
      query: `SELECT * FROM mindsdb.olla WHERE comment=${text}`
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
app.post("/reply", async function (req, res) {
  let text = req.body.text;
  console.log(text);
  try {
    // Connect to MindsDB Cloud
    const email = process.env.REACT_APP_MINDSDB_USERNAME;
    const password = process.env.REACT_APP_MINDSDB_PASSWORD;
    const session = await connectToMindsDBCloud(email, password);
    console.log("Connected to MindsDB Cloud. Session:", session.data);

    // Get reply text from MindsDB
    let replyMsg = await getReplyText(text);
    console.log("Reply received from MindsDB:", replyMsg);
    let retValue = replyMsg["data"]["reply"];
    res.json({ reply: retValue });
  } catch (error) {
    console.log("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
