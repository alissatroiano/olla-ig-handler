import express from 'express'
import MindsDB from 'mindsdb-js-sdk'

const router = express.Router();

router.get('/', (req, res) => {

    const getReplyData = async (comment) => {
        const model = await MindsDB.default.Models.getModel(
            "olla",
            "mindsdb"
        );

        const queryOptions = {
            where: [`comment = "${comment}"`],
        };

        const prediction = await model.query(queryOptions);
        return prediction;
    };

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
});

export { router };