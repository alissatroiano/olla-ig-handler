const express = require("express");
const http = require("http");
const fs = require("fs");
const bodyParser = require("body-parser");
const ngrok = require("@ngrok/ngrok");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const app = express();
const PORT = process.env.PORT || 3001;

const options = {
  key: fs.readFileSync("private-key.pem"),
  cert: fs.readFileSync("certificate.pem"),
};

// Start the http server
const server = http.createServer(options, app);

// Body parser middleware should be applied to the express app
app.use(bodyParser.json());

// Handle verification request from Facebook
app.get("/webhooks", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const verifyToken = req.query["hub.verify_token"];

  // Check if the mode is "subscribe" and verify the token
  if (mode === "subscribe" && verifyToken === '') {
    // Respond with the challenge parameter
    res.status(200).send(challenge);
  } else {
    // Verification failed
    res.status(403).send("Verification failed");
  }
});

// Endpoint to handle event notifications
app.post("/webhooks", (req, res) => {
  // Log the received payload
  console.log("Received webhook payload:", req.body);

  // Save the payload data to a file
  fs.writeFile("webhook_payload.json", JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error("Error saving payload data to file:", err);
    } else {
      console.log("Payload data saved to webhook_payload.json");
    }
  });
  res.status(200).send("Webhook received successfully");
});


// Start the server
server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);

  try {
    // Establish ngrok tunnel with authtoken
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
