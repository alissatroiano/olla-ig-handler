import express from "express";
import MindsDB from "mindsdb-js-sdk";

const router = express.Router();

router.get("/", (req, res) => {
  const getReplyData = async (comment) => {
    const model = await MindsDB.default.Models.getModel("olla", "mindsdb");

    const queryOptions = {
      where: [`comment = "${comment}"`],
    };

    const prediction = await model.query(queryOptions);
    return prediction;
  };
  MindsDB.default.Models.getModel('olla').then(
    router.post("/reply", async function (req, res) {
        let comment = req.body.comment;
        console.log(comment);
        try {
          await connectToMindsDB(user);
          let replyText = await getReplyData(comment);
          console.log(replyText);
          let retValue = replyText["data"]["reply"];
          res.json({ reply: retValue });
          console.log("Router is working" + retValue);
        } catch (error) {
          console.log(`Error: ${error}`);
          res.json(error);
        }
      })
  )});

export { router };
