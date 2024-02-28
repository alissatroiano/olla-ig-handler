import express from 'express'
import bodyParser from 'body-parser'
import  cors from 'cors'
import MindsDB from 'mindsdb-js-sdk'
import dotenv from 'dotenv'; 
dotenv.config({ path: '.env' });
const PORT = process.env.PORT || 8080;

import { router as reply } from './routes/reply.js'
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cors())

const user = {
  user: process.env.MINDSDB_USERNAME,
  password: process.env.MINDSDB_PASSWORD,
};

const connectToMindsDB = async (user) => {
  await MindsDB.default.connect(user);
  console.log('Connected!');
};
connectToMindsDB(user);

app.use('/reply/', reply);

//handle undefined routes
app.use((req, res, next) => {
  res.status(404).send({
      message: "Sorry, the requested route does not exist!"
  })
  next()
})

//handle errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
      message: "An error occured. ",
      error: err.toString()
  })
})

// Run the API
app.listen(PORT, () => {
  console.log(`Listening at Port ${PORT}`);
});
