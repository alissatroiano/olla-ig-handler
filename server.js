// Import necessary modules
const express = require("express");
const MindsDB = require("mindsdb-js-sdk");
require("dotenv").config();
const { Model } = require('mindsdb-js-sdk');
import Model from 'mindsdb-js-sdk';
// Create an instance of Express
const app = express();

// Connect to MindsDB
const connectToMindsDB = async () => {
  try {
    await MindsDB.default.connect({
      user: process.env.REACT_APP_MINDSDB_USERNAME,
      password: process.env.REACT_APP_MINDSDB_PASSWORD,
    });
    console.log("Connected to MindsDB successfully");
  } catch (error) {
    console.error("Failed to connect to MindsDB:", error);
  }
};

(async () => {
  await connectToMindsDB(); // Call the async function here
  const myModel = await Model.get('olla_mod'); // Now you can use await
})();

app.use(express.json()); // Add this line to parse JSON bodies

app.post("/comments", async (req, res) => {
  try {
    // Assuming the comments data is received in the request body
    const comments = req.body.comments;

    // Send comments data to MindsDB as a prompt
    const predictions = await myModel.predict(comments);

    // Return predictions as a response
    res.json(predictions);
  } catch (error) {
    // Handle any errors
    console.error("An error occurred while processing comments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing comments" });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
