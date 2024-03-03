import express, { Router } from "express";
import serverless from "serverless-http";
import MindsDB from "mindsdb-js-sdk";
import { router as reply } from "../../backend/connect.js";
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const cors = require("cors");

const PORT = process.env.PORT || 4000;
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

const user = {
  user: process.env.MINDSDB_USER,
  password: process.env.MINDSDB_PASS,
};
const connectToMindsDB = async (user) => {
  await MindsDB.default.connect(user);
  console.log("Connected!");
};
connectToMindsDB(user);

app.use(express.static("build"));
app.use("/reply", reply);

export const handler = serverless(app);
