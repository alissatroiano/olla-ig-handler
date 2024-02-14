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
        scope: "instagram_basic,pages_show_list",
      }
    );
  };

  const logOutOfFB = () => {
    window.FB.logout(() => {
      setFacebookUserAccessToken(undefined);
    });
  };


  return (
    <div className="App">
      <div className="container-fluid">
          <div className="row text-center d-flex justify-content-center align-items-center">
            <div className="appWrapper p-1 p-md-3">
            <div className="col-12 my-3 pt-2">
            <section className="card h-100 welcome-container">
              <div className="intro">
            <h1 className="title mb-3">OLLA AI <br /><span className="titleSpan">FOR INSTAGRAM</span></h1>
            </div>
            <div className="instructions px-md-3">
            <p className="loginDetails">
            Login with Facebook to give <strong>
              <a href="www.olla.ai" target='_blank' id='link-to-olla'>
              Olla AI
              </a> </strong>
              permission to access your
            Instagram Business Account's data.
          </p>
          </div>
          <div className="row d-flex align-items-center justify-content-center">
          <div className="col-6">
                {facebookUserAccessToken ? (
                  <button onClick={logOutOfFB} className="btn action-btn">
                    Log out of Facebook
                  </button>
                ) : (
                  <button onClick={logInToFB} className="btn action-btn">
                    Login with Facebook
                  </button>
                )}
                </div>
                <div className="col-6">
                     <StepByStep facebookUserAccessToken={facebookUserAccessToken} />
                     </div>
                     </div>
              </section>
            </div>
            </div>
          </div>
        </div>
      </div>

  );
}

export default App;
