const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const MindsDB = require("mindsdb-js-sdk");
dotenv.config({ path: ".env" });
const path = require("path");
const PORT = process.env.PORT || 8080;
const http = require("http");
const ngrok = require("@ngrok/ngrok");
const buildPath = path.join(__dirname, "build");
const app = express();
app.use(express.static("build"));

const server = http.createServer(app);

const getReplyData = async (comment) => {
  const model = await MindsDB.default.Models.getModel("olla", "mindsdb");

  const queryOptions = {
    where: [`comment = "${comment}"`],
  };

  const prediction = await model.query(queryOptions);
  return prediction;
};

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
app.use(express.static(buildPath));
// gets the static files from the build folder
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const xhub = require("express-x-hub");

app.use(xhub({ algorithm: "sha1", secret: "" }));

const TOKEN = "EAAK7epYUeH4BOxutHVPnx";
const received_updates = [];

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

app.get("/", function (req, res) {
  console.log(_.pick(req, ["headers", "body", "params", "query"]));
  res.send("<pre>" + JSON.stringify(received_updates, null, 2) + "</pre>");
});

app.get("/webhooks", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const verifyToken = req.query["hub.verify_token"];

  // Check if the mode is "subscribe" and verify the token
  if (mode === "subscribe" && verifyToken === TOKEN) {
    // Respond with the challenge parameter as plain text
    res.set("Content-Type", "text/plain");
    res.status(200).send(challenge);
  } else {
    // Verification failed
    res.status(403).send("Verification failed");
  }
});

app.post("/webhooks", async function (req, res) {
  try {
    console.log("Facebook Request:");
    console.log(
      JSON.stringify(_.pick(req, ["headers", "body", "params", "query"]))
    );
    console.log("--------------------");

    if (!req.isXHubValid()) {
      console.log(
        "Warning - request header X-Hub-Signature not present or invalid"
      );
      res.sendStatus(401);
      return;
    }
    // Process the Facebook updates here
    received_updates.unshift(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.log("ERROR - /webhooks:", error);
    return res.sendStatus(200);
  }
});


server.listen(PORT, async () => {
  console.log(`Server Listening at Port ${PORT}`);

  try {
    const tunnel = await ngrok.connect({
      proto: "http",
      addr: PORT,
      authtoken: process.env.NGROK_AUTHTOKEN,
    });

    console.log("Ngrok tunnel established:", tunnel);
  } catch (error) {
    console.error("Error establishing ngrok tunnel:", error);
  }
});


module.exports = app;
