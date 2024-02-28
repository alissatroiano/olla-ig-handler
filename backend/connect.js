import express from 'express'
import bodyParser from 'body-parser'
import  cors from 'cors'
import MindsDB from 'mindsdb-js-sdk'
import dotenv from 'dotenv'; 
dotenv.config({ path: '.env' });

import { router as reply } from './routes/reply.js'

// Express API setup
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
  user: process.env.MINDSDB_USERNAME,
  password: process.env.MINDSDB_PASSWORD,
};

const connectToMindsDB = async (user) => {
  await MindsDB.default.connect(user);
  console.log('Connected!');
};
connectToMindsDB(user);


app.use('/reply', reply);


// Base route
app.get("/", function (req, res) {
  return res.json("Hello world!");
});

// Run the API
const port = 8080;
app.listen(port, () => {
  console.log(`Listening at Port ${port}`);
});
