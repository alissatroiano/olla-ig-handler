import "./App.css";
import React, { useEffect, useState } from "react";
import StepByStep, {shouldShowAllSteps, setShouldShowAllSteps } from "../StepByStep/StepByStep";

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
          <div className="row text-center d-flex justify-content-center align-items-center my-0 mx-auto">
            <div className="appWrapper py-3 py-md-5 card h-100 welcome-container">
            <div className="col-12 my-3 pt-2">
              <div className="intro">
            <h1 className="title my-3">OLLA AI <br /><span className="titleSpan">FOR INSTAGRAM</span></h1>
            </div>
            <div className="instructions">
            <p className="loginDetails px-3 px-md-4">
            Login with Facebook to give <strong>
              <a href="www.olla.ai" target='_blank' id='link-to-olla'>
              Olla AI
              </a> </strong>
              permission to access your
            Instagram Business Account's data.
          </p>
     
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
                    </div>
                    <div className="col-12 text-center align-items-center justify-content-center">
                     <StepByStep facebookUserAccessToken={facebookUserAccessToken} />
                     </div>
                    </div>
               
                     </div>
            </div>
            
          </div>
  );
}

export default App;
