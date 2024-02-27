const express = require("express");
const MindsDB = require("mindsdb-js-sdk").default;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const axios = require("axios");
const PORT = process.env.PORT || 3000;

const email = process.env.REACT_APP_MINDSDB_USERNAME;
const password = process.env.REACT_APP_MINDSDB_PASSWORD;

// Connect to MindsDB
const connectToMindsDBCloud = async (email, password) => {
  try {
    // Create a session with MindsDB Cloud
    const session = await axios.post("https://cloud.mindsdb.com/cloud/login", {
      email,
      password,
    });
    return session;
  } catch (error) {
    console.error("Error connecting to MindsDB Cloud:", error);
    throw error;
  }
};

const queryMindsDB = async (comment) => {
  let myModels = MindsDB.default.Models.getAllModels;
  
  try {
    const response = await MindsDB.default.Models.queryModel({
      query: `SELECT * FROM mindsdb.olla WHERE comment = '${comment}'`,
    });
    console.log("Response from MindsDB:", response);
    return response.data;
  } catch (error) {
    console.error("Error querying MindsDB:", error);
    throw error;
  }
};

connectToMindsDBCloud(email, password)
  .then((session) => {
    console.log("Connected to MindsDB Cloud. Session:", session.data);
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
    console.log(model);
    const response = await model.query({
      queryOptions: {
        name: "olla",
        project: "mindsdb",
        targetColumn: "reply",
        where: whereClause, 
      },
      params: [text],
    });

    console.log(response.data);
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

// Reply route
app.post("/data", async function (req, res) {
  let comment = req.body.comment;
  console.log("Received comment:", comment); // Log the received comment
  console.log("Request queued to send to MindsDB endpoint:", comment);
  try {
    const reply = await MindsDB.default.Models.queryModel({
      query: `SELECT * FROM mindsdb.olla WHERE comment = '${comment}'`,
    });
    res.json({ reply });
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
