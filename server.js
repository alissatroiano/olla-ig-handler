const express = require("express");
const MindsDB = require("mindsdb-js-sdk");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const axios = require('axios');

const PORT = process.env.PORT || 3000;


// Connect to MindsDB
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

// Example usage
const email = process.env.REACT_APP_MINDSDB_USERNAME;
const password = process.env.REACT_APP_MINDSDB_PASSWORD;

connectToMindsDBCloud(email, password)
  .then(session => {
    console.log("Connected to MindsDB Cloud. Session:", session.data);
    // Proceed with making queries or other actions using the session
  })
  .catch(error => {
    console.error("Error connecting to MindsDB Cloud:", error);
  });

  const getReplyText = async (text) => {
    try {
      const response = await MindsDB.default.query({
        query: "SELECT * FROM mindsdb.olla WHERE comment = ?",
        params: [text]
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
  let comment = req.body.comment; // Change from req.body.text to req.body.comment
  console.log("Request queued to send to MindsDB endpoint" + comment);
  try {
    await connectToMindsDBCloud(email, password);
    console.log("Connected to MindsDB successfully");
    let replyMsg = await getReplyText(comment); // Pass comment instead of text
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
