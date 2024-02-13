import "./App.css";
import React, { useEffect, useState } from "react";
// import env from "react-dotenv";
import StepByStep from "../StepByStep/StepByStep";

function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [postCaption, setPostCaption] = useState("");
  const [facebookUserAccessToken, setFacebookUserAccessToken] = useState("");


  // Check if the user is authengitticated with Facebook
  useEffect(() => {
    window.FB.getLoginStatus((response) => {
      setFacebookUserAccessToken(response.authResponse?.accessToken);
    });
  }, []);

  const logInToFB = () => {
    window.FB.login(
      (response) => {
        setFacebookUserAccessToken(response.authResponse?.accessToken);
      },
      {
        // Scopes that allow us to publish content to Instagram
        scope:
          "instagram_basic,pages_show_list, instagram_content_publish, business_management,instagram_manage_comments, instagram_manage_insights, instagram_manage_messages,pages_read_engagement, pages_manage_metadata, pages_read_user_content, pages_manage_posts ",
      }
    );
  };

  const logOutOfFB = () => {
    window.FB.logout(() => {
      setFacebookUserAccessToken(undefined);
    });
  };

  /* --------------------------------------------------------
   *             INSTAGRAM AND FACEBOOK GRAPH APIs
   * --------------------------------------------------------
   */

  const getFacebookPages = () => {
    return new Promise((resolve) => {
      window.FB.api(
        "me/accounts",
        { access_token: facebookUserAccessToken },
        (response) => {
          resolve(response.data);
        }
      );
    });
  };

  const getInstagramAccountId = (facebookPageId) => {
    return new Promise((resolve) => {
      window.FB.api(
        facebookPageId,
        {
          access_token: facebookUserAccessToken,
          fields: "instagram_business_account",
        },
        (response) => {
          resolve(response.instagram_business_account.id);
          console.log(facebookPageId);
        }
      );
    });
  };

  const createMediaObjectContainer = (instagramAccountId) => {
    return new Promise((resolve) => {
      window.FB.api(
        `${instagramAccountId}/media`,
        "POST",
        {
          access_token: facebookUserAccessToken,
          image_url: imageUrl,
          caption: postCaption,
        },
        (response) => {
          resolve(response.id);
        }
      );
    });
  };

  const publishMediaObjectContainer = (
    instagramAccountId,
    mediaObjectContainerId
  ) => {
    return new Promise((resolve) => {
      window.FB.api(
        `${instagramAccountId}/media_publish`,
        "POST",
        {
          access_token: facebookUserAccessToken,
          creation_id: mediaObjectContainerId,
        },
        (response) => {
          resolve(response.id);
        }
      );
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">Welcome to Olla AI</h1>
      </header>
      <div className="container-fluid">
        <div className="App">
          <div className="row text-center d-flex justify-content-center align-items-center">
            <div className="col-10 my-3 pt-2">
            <section className="card h-100 welcome-container">
            <div className="loginDetails">
            Login with Facebook to give <strong>
              <a href="www.olla.ai" target='_blank' id='link-to-olla'>
              Olla AI
              </a> </strong>
              permission to access your
            Instagram Business Account's data
          </div>
                {facebookUserAccessToken ? (
                  <button onClick={logOutOfFB} className="btn action-btn">
                    Log out of Facebook
                  </button>
                ) : (
                  <button onClick={logInToFB} className="btn action-btn">
                    Login with Facebook
                  </button>
                )}
                     <StepByStep facebookUserAccessToken={facebookUserAccessToken} />
              </section>
         
              {/* <div id="profile"></div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
