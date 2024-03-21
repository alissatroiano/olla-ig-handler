import React, { useEffect, useState, useCallback, useRef } from "react";
import initFacebookSDK from "../../initFacebookSDK";
import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../Logo/Logo";
import axios from "axios";

library.add(fab);

function App() {
  const [facebookUserAccessToken, setFacebookUserAccessToken] = useState("");
  const [, setFacebookPages] = useState([]);
  const [, setInstagramAccountId] = useState("");
  const [, setMediaList] = useState([]);
  const [comment, setComment] = useState("");
  const [reply, setReply] = useState("");
  const [repliedComments, setRepliedComments] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const commentIdRef = useRef(null);

  useEffect(() => {
    console.log("Updated repliedComments:", repliedComments);
  }, [repliedComments]);

  const fetchInstagramBusinessAccount = useCallback((pageId, accessToken) => {
    window.FB.api(
      `/${pageId}`,
      "GET",
      { access_token: accessToken, fields: "instagram_business_account" },
      (response) => {
        if (response.instagram_business_account) {
          setInstagramAccountId(response.instagram_business_account.id);
          fetchMediaObjects(
            pageId,
            response.instagram_business_account.id,
            accessToken
          );
        }
      }
    );
  }, []);

  const fetchUserPages = useCallback(
    (accessToken) => {
      window.FB.api(
        "/me/accounts",
        "GET",
        { access_token: accessToken },
        (response) => {
          setFacebookPages(response.data);
          if (response.data.length > 0) {
            const pageId = response.data[0].id;
            fetchInstagramBusinessAccount(pageId, accessToken);
          }
        }
      );
    },
    [fetchInstagramBusinessAccount]
  );

  useEffect(() => {
    const checkLoginStatus = async () => {
      await initFacebookSDK();
      window.FB.getLoginStatus((response) => {
        if (response.status === "connected") {
          setFacebookUserAccessToken(response.authResponse.accessToken);
          fetchUserPages(response.authResponse.accessToken);
        }
      });
    };

    checkLoginStatus();
  }, [fetchUserPages]);

  const fetchMediaObjects = (pageId, instagramAccountId, accessToken) => {
    window.FB.api(
      `/${instagramAccountId}/media`,
      "GET",
      { access_token: accessToken },
      (response) => {
        if (response.data) {
          const mostRecentMedia = response.data[0];
          setMediaList(mostRecentMedia);
          fetchCommentsForMedia(mostRecentMedia.id, accessToken);
        }
      }
    );
  };

  const fetchCommentsForMedia = (mediaId, accessToken) => {
    window.FB.api(
      `/${mediaId}/comments`,
      "GET",
      { access_token: accessToken },
      async (response) => {
        if (response.data && response.data.length > 0) {
          const mostRecentComment = response.data[0];
          const commentId = mostRecentComment.id;
          // Check if the commentId has already been replied to
          if (repliedComments.includes(commentId)) {
            setComment(mostRecentComment.text);
            // Set the commentId using the useRef hook
            commentIdRef.current = commentId;
            await sendCommentToServer(commentId, mostRecentComment.text);
          }
        }
      }
    );
  };
  
  useEffect(() => {
    // Check if there are any replied comments stored in local storage
    const storedRepliedComments = localStorage.getItem("repliedComments");
    if (storedRepliedComments) {
      setRepliedComments(JSON.parse(storedRepliedComments));
    }
  }, []);

  const sendCommentToServer = async (commentId, commentText) => {
    try {
      // Check if the commentId has already been replied to
      if (
        !repliedComments.includes(commentId) &&
        commentId === commentIdRef.current
      ) {
        const response = await axios.post("http://localhost:8080/reply", {
          commentId: commentId,
          comment: commentText,
        });
        console.log("Predictions:", response);
        const replyMessage = response.data.reply;
        setReply(replyMessage);

        // Update the repliedComments array with the new commentId
        const updatedRepliedComments = [...repliedComments, commentId];
        setRepliedComments(updatedRepliedComments);
        localStorage.setItem(
          "repliedComments",
          JSON.stringify(updatedRepliedComments)
        ); // Store replied comments in local storage

        // Post the reply to Instagram
        await postReplyToInstagram(commentId, replyMessage, accessToken);
      } else {
        console.log(
          "Already replied to this comment or not the current user's comment:",
          commentId
        );
      }
    } catch (error) {
      console.error("Error sending comment to server:", error);
    }
  };

  const postReplyToInstagram = async (commentId, message, accessToken) => {
    try {
      // Check if the commentId has already been replied to
      if (repliedComments.includes(commentId)) {
        console.log("Already replied to this comment:", commentId);
        return; // Exit early if already replied
      }

      // Use the FB.api method to post a reply to the comment
      window.FB.api(
        `https://graph.facebook.com/${commentId}/replies`,
        "POST",
        { message: message, access_token: accessToken },
        (response) => {
          if (response && !response.error) {
            console.log("Reply posted to Instagram:", response);
          } else {
            console.error("Error posting reply to Instagram:", response.error);
          }
        }
      );
      setRepliedComments([...repliedComments, commentId]);
    } catch (error) {
      console.error("Error posting reply to Instagram:", error);
    }
  };

  const logInToFB = () => {
    window.FB.login(
      (response) => {
        if (response.status === "connected") {
          setFacebookUserAccessToken(response.authResponse.accessToken);
          setAccessToken(response.authResponse.accessToken);
          fetchUserPages(response.authResponse.accessToken);
        }
      },
      {
        scope:
          "pages_show_list, pages_read_engagement, instagram_basic, instagram_manage_comments, business_management, pages_manage_metadata",
      }
    );
  };

  const logOutOfFB = () => {
    window.FB.logout(() => {});
  };

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row text-center d-flex justify-content-center align-items-center my-0 mx-auto">
          <div className="appWrapper py-5">
            <div className="welcome-container mt-3 mt-md-4">
              <div className="col-12">
                <Logo />
                <h1 className="title my-3">
                  OLLA AI <br />
                  <span className="titleSpan">FOR INSTAGRAM</span>
                </h1>
              </div>
              <div className="col-12">
                <div className="instructions my-3 my-md-4">
                  <p className="loginDetails px-md-1">
                    Login with Facebook to give{" "}
                    <strong>
                      <a href="www.olla.ai" target="_blank" id="link-to-olla">
                        Olla AI
                      </a>{" "}
                    </strong>
                    permission to access your Instagram Business Account's data.
                  </p>
                  {facebookUserAccessToken ? (
                    <button
                      onClick={logOutOfFB}
                      className="btn action-btn"
                      id="logoutBtn"
                    >
                      <FontAwesomeIcon
                        className="icon me-2"
                        icon={["fab", "facebook"]}
                      />
                      Log out
                    </button>
                  ) : (
                    <button
                      onClick={logInToFB}
                      className="btn action-btn"
                      id="loginBtn"
                    >
                      <FontAwesomeIcon
                        className="icon me-2"
                        icon={["fab", "facebook"]}
                      />
                      Login with Facebook
                    </button>
                  )}
                </div>
              </div>
              <div className="d-flex row">
                <div className="col-12 col-sm-6 text-center text-sm-end">
                  <h3 className="heading-comments">
                    Comments from your latest post:
                  </h3>
                </div>
                <div className="col-12 col-sm-6 text-center text-sm-start">
                  <div className="comment">
                    <div>{comment}</div> {/* Display the comment */}
                    {reply && ( // Display the reply if available
                      <div className="reply">
                        <strong>Reply:</strong> {reply}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;