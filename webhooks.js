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

// Body parser middleware should be applied to the express app
app.use(bodyParser.json());

// Handle verification request from Facebook
app.get("/webhooks", (req, res) => {
  const mode = req.query['hub.mode'];
  const challenge = req.query['hub.challenge'];
  const verifyToken = req.query['hub.verify_token'];

  // Your verification token configured in Facebook
  const expectedVerifyToken = process.env.FACEBOOK_VERIFY_TOKEN;

  // Verify that the hub.verify_token value matches the string you set in the Verify Token field
  if (mode === 'subscribe' && verifyToken === expectedVerifyToken) {
    // Respond with the hub.challenge value
    res.status(200).send(challenge);
  } else {
    // Verification failed
    res.status(403).send('Verification failed');
  }
});

// Handle incoming webhook events
app.post("/webhooks", (req, res) => {
  // Parse the incoming data automatically using bodyParser
  const data = req.body;

  // Log the received data for debugging
  console.log("Received webhook event:", data);

  // Handle webhook events here

  // Send a response to confirm receipt of the webhook event
  res.status(200).send("Webhook received");
});

// Start the http server
const server = http.createServer(options, app);

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);

  try {
    // Establish ngrok tunnel with authtoken
    const tunnel = await ngrok.connect({
      proto: 'http',
      addr: PORT,
      authtoken: process.env.NGROK_AUTHTOKEN
    });

    console.log('Ngrok tunnel established:', tunnel);
  } catch (error) {
    console.error('Error establishing ngrok tunnel:', error);
  }
});
