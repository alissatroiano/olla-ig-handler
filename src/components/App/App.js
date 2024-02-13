import "./App.css";
import React, { useEffect, useState } from "react";
import StepByStep from "../StepByStep/StepByStep";

function App() {
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
          "instagram_basic,pages_show_list,instagram_content_publish, business_management,instagram_manage_comments, instagram_manage_insights, instagram_manage_messages,pages_read_engagement, pages_manage_metadata, pages_read_user_content, pages_manage_posts ",
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
