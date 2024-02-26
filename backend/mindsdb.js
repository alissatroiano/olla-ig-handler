const MindsDB = require("mindsdb-js-sdk").default;
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const PORT = process.env.PORT || 8000;


// MindsDB setup
const user = {
	user: process.env.MINDSDB_USER,
	password: process.env.MINDSDB_PASS,
};

const connectToMindsDB = async (user) => {
	await MindsDB.default.connect(user);
};



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

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
