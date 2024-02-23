import React, { useEffect, useState, useCallback } from "react";
import initFacebookSDK from "../../initFacebookSDK";
import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../Logo/Logo";

library.add(fab);

function App() {
  const [facebookUserAccessToken, setFacebookUserAccessToken] = useState("");
  const [facebookPages, setFacebookPages] = useState([]);
  const [instagramAccountId, setInstagramAccountId] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [comments, setComments] = useState([]); // New state for comments

  const fetchInstagramBusinessAccount = useCallback((pageId, accessToken) => {
    window.FB.api(
      `/${pageId}`,
      "GET",
      { access_token: accessToken, fields: "instagram_business_account" },
      (response) => {
        if (response.instagram_business_account) {
          setInstagramAccountId(response.instagram_business_account.id);
          fetchMediaObjects(pageId, response.instagram_business_account.id, accessToken);
        }
      }
    );
  }, []);

  const fetchUserPages = useCallback((accessToken) => {
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
  }, [fetchInstagramBusinessAccount]);

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
      (response) => {
        if (response.data) {
          setComments(response.data);
          console.log(response.data);
          const comments = response.data.text;
          return comments;
        }
      }
    );
  };

  const logInToFB = () => {
    window.FB.login(
      (response) => {
        if (response.status === "connected") {
          setFacebookUserAccessToken(response.authResponse.accessToken);
          fetchUserPages(response.authResponse.accessToken);
        }
      },
      {
        scope:
          "instagram_basic,pages_show_list, instagram_content_publish, business_management,instagram_manage_comments, instagram_manage_insights, instagram_manage_messages,pages_read_engagement, pages_manage_metadata, pages_read_user_content, pages_manage_posts",
      }
    );
  };

  const logOutOfFB = () => {
    window.FB.logout(() => {
      setFacebookUserAccessToken("");
      setFacebookPages([]);
      setInstagramAccountId("");
    });
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
              <div className="col-12 text-center align-items-center justify-content-center">
                <button
                  className="getComments"
                  onClick={fetchCommentsForMedia}
                  id="commentsData"
                >
                  Get Comments
                </button>
              </div>
              <div className="comments">
                {comments.map((comment, index) => (
                  <div key={index} className="comment">
                    {comment.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
