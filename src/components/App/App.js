import React, { useEffect, useState, useCallback } from "react";
import initFacebookSDK from "../../initFacebookSDK";
import "./App.css";
import StepByStep from "../StepByStep/StepByStep";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(fab)

function App() {
  const [facebookUserAccessToken, setFacebookUserAccessToken] = useState("");
  const [facebookPages, setFacebookPages] = useState([]);
  const [instagramAccountId, setInstagramAccountId] = useState("");
  // eslint-disable-next-line
  const [mediaList, setMediaList] = useState([]); 

  const fetchInstagramBusinessAccount = useCallback((pageId, accessToken) => {
    window.FB.api(
      `/${pageId}`,
      'GET',
      { access_token: accessToken, fields: 'instagram_business_account' },
      (response) => {
        if (response.instagram_business_account) {
          setInstagramAccountId(response.instagram_business_account.id);
          console.log("Instagram business account ID:", response.instagram_business_account.id);
          fetchMediaObjects(pageId, response.instagram_business_account.id, accessToken);
        }
      }
    );
  }, []);

  const fetchUserPages = useCallback((accessToken) => {
    window.FB.api(
      '/me/accounts',
      'GET',
      { access_token: accessToken },
      (response) => {
        setFacebookPages(response.data);
        if (response.data.length > 0) {
          const pageId = response.data[0].id;
          console.log("User's page ID:", pageId);
          fetchInstagramBusinessAccount(pageId, accessToken);
        }
      }
    );
  }, [fetchInstagramBusinessAccount]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      await initFacebookSDK();
      window.FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
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
      'GET',
      { access_token: accessToken },
      (response) => {
        if (response.data) {
          setMediaList(response.data);
          console.log("Media objects:", response.data);
        }
      }
    );
  };
  
  
  const logInToFB = () => {
    window.FB.login(
      (response) => {
        if (response.status === 'connected') {
          setFacebookUserAccessToken(response.authResponse.accessToken);
          fetchUserPages(response.authResponse.accessToken);
        }
      },
      {
        scope: "instagram_basic,pages_show_list, instagram_content_publish, business_management,instagram_manage_comments, instagram_manage_insights, instagram_manage_messages,pages_read_engagement, pages_manage_metadata, pages_read_user_content, pages_manage_posts",
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
          <div className="appWrapper py-3 py-md-5 card h-100 welcome-container">
            <div className="col-12 my-3 pt-2 pt-sm-3 pt-md-4">
              <h1 className="title my-3">
                OLLA AI <br />
                <span className="titleSpan">FOR INSTAGRAM</span>
              </h1>
            </div>
            <div className="col-12 col-sm-8 offset-sm-2">
              <div className="instructions my-3 my-md-4">
                <p className="loginDetails px-3 px-md-4">
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
                    Log out 
                    <FontAwesomeIcon className="icon ms-2" icon={['fab', 'facebook']} />
                  </button> 
                ) : (
                  <button
                    onClick={logInToFB}
                    className="btn action-btn"
                    id="loginBtn"
                  >
                    Login
                    <FontAwesomeIcon className="icon ms-2" icon={['fab', 'facebook']} />
                  </button>
                )}
              </div>
            </div>
            <div className="col-12 text-center align-items-center justify-content-center">
              <StepByStep
                facebookUserAccessToken={facebookUserAccessToken}
                facebookPages={facebookPages}
                instagramAccountId={instagramAccountId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
