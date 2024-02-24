const express = require("express");
const MindsDB = require("mindsdb-js-sdk");
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
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
connectToMindsDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send({
    message: "An error occurred",
    error: err.toString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
