import React, { useState, useEffect } from "react";

function Comments({ mediaList }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
        try {
          const response = await fetch('http://your-backend-server.com/save-comments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(mediaList),
          });
          if (response.ok) {
            console.log('Comments data sent successfully');
          } else {
            console.error('Failed to send comments data');
          }
        } catch (error) {
          console.error('Error sending comments data:', error);
        }
      };
      
  }, []);

  const import React, { useState, useEffect } from "react";

  function Comments({ mediaList }) {
    const [comments, setComments] = useState([]);
  
    useEffect(() => {
      const fetchComments = async () => {
          try {
            const response = await fetch('http://your-backend-server.com/save-comments', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(mediaList),
            });
            if (response.ok) {
              console.log('Comments data sent successfully');
            } else {
              console.error('Failed to send comments data');
            }
          } catch (error) {
            console.error('Error sending comments data:', error);
          }
        };
        
    }, []);
  
    const fetchCommentsForMedia = (mediaId, accessToken) => {
      window.FB.api(
        `/${mediaId}/comments`,
        "GET",
        { access_token: accessToken },
        (response) => {
          if (response.data) {
            console.log("Comments for media object:", response.data);
          }
        }
      );
    };
  
    const sendCommentsToServer = async () => {
      try {
        const response = await fetch(
          "http://your-backend-server.com/save-comments",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mediaList),
          }
        );
        if (response.ok) {
          console.log("Comments data sent successfully");
        } else {
          console.error("Failed to send comments data");
        }
      } catch (error) {
        console.error("Error sending comments data:", error);
      }
    };
  
    return <div>{/* Comments UI */}</div>;
  }
  
  export default Comments;
   = (mediaId, accessToken) => {
    window.FB.api(
      `/${mediaId}/comments`,
      "GET",
      { access_token: accessToken },
      (response) => {
        if (response.data) {
          console.log("Comments for media object:", response.data);
        }
      }
    );
  };

  const sendCommentsToServer = async () => {
    try {
      const response = await fetch(
        "http://your-backend-server.com/save-comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mediaList),
        }
      );
      if (response.ok) {
        console.log("Comments data sent successfully");
      } else {
        console.error("Failed to send comments data");
      }
    } catch (error) {
      console.error("Error sending comments data:", error);
    }
  };

  return <div>{/* Comments UI */}</div>;
}

export default Comments;
