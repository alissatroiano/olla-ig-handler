const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    // Parse the incoming data
    const data = req.body;
  
    // Log the received data for debugging
    console.log('Received webhook event:', data);
  
    // Handle different types of events
    if (data.object === 'page') {
      // Iterate over each entry (page) in the webhook payload
      data.entry.forEach(entry => {
        // Iterate over each messaging event
        entry.messaging.forEach(event => {
          // Handle different types of messaging events
          if (event.message) {
            // Handle message event
            handleMessageEvent(event);
          } else if (event.postback) {
            // Handle postback event
            handlePostbackEvent(event);
          }
          // Add more event types as needed
        });
      });
    }
  
    // Send a response to confirm receipt of the webhook event
    res.status(200).send('Webhook received');
  });
  
  function handleMessageEvent(event) {
    console.log('Received message event:', event.message);
  }
  
  function handlePostbackEvent(event) {
    // Handle postback event logic here
    console.log('Received postback event:', event.postback);
  }  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
