const http = require("http");
const ngrok = require("@ngrok/ngrok");

const server = http.createServer((req, res) => {
  if (req.url === "/webhook" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // Convert Buffer to string
    });
    req.on("end", () => {
      console.log("Received webhook event:", JSON.parse(body));
      res.writeHead(200);
      res.end("Webhook received");
    });
  } else if (req.url.startsWith("/webhook") && req.method === "GET") {
    // Handle verification request from Facebook
    const queryParams = new URLSearchParams(req.url.split("?")[1]);
    const mode = queryParams.get("hub.mode");
    const challenge = queryParams.get("hub.challenge");
    const verifyToken = queryParams.get("hub.verify_token");

    // Your verification token configured in Facebook
    const expectedVerifyToken = process.env.FACEBOOK_VERIFY_TOKEN;

    // Verify that the hub.verify_token value matches the string you set in the Verify Token field
    if (mode === "subscribe" && verifyToken === expectedVerifyToken) {
      // Respond with the hub.challenge value
      res.writeHead(200);
      res.end(challenge);
    } else {
      // Verification failed
      res.writeHead(403);
      res.end("Verification failed");
    }
  } else {
    // Respond with a simple message for other requests
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Congrats you have created an ngrok web server");
  }
});

server.listen(8080, () => {
  console.log("Node.js web server at 8080 is running...");
});

// Get your endpoint online
ngrok
  .connect({ addr: 8080, authtoken_from_env: true })
  .then((listener) => console.log(`Ingress established at: ${listener.url()}`));
