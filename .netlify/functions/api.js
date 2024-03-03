import express, { Router } from "express";
import serverless from "serverless-http";
import MindsDB from "mindsdb-js-sdk";

export default async (req, context) => {
  const user = {
    user: process.env.MINDSDB_USER,
    password: process.env.MINDSDB_PASS,
  };
  const connectToMindsDB = async (user) => {
    await MindsDB.default.connect(user);
    console.log("Connected!");
  };
  connectToMindsDB(user);
  // Express API setup
  const app = express();
  app.use(express.static("build"));
  const getReplyData = async (comment) => {
    const model = await MindsDB.default.Models.getModel("olla", "mindsdb");

    const queryOptions = {
      where: [`comment = "${comment}"`],
    };

    const prediction = await model.query(queryOptions);
    return prediction;
  };
  // Text summarisation route
  app.post("/reply", async function (req, res) {
    let comment = req.body.comment;
    console.log(comment);
    try {
      await connectToMindsDB(user);
      let replyText = await getReplyData(comment);
      let retValue = replyText["data"]["reply"];
      res.json({ reply: retValue });
      console.log(retValue);
    } catch (error) {
      console.log(`Error: ${error}`);
      res.json(error);
    }
  });
};

export const handler = serverless(app);

