
import './LoginButton.css';
import React, { useState } from "react";
import { render } from "react-dom";
import FacebookLogin from "react-facebook-login";

const LoginButton = () => {
  const [accessToken, setAccessToken] = useState("");

  const componentClicked = (data) => {
    console.log("data", data);
  };

  const responseFacebook = (response) => {
    console.log(response.accessToken);
    // setAccessToken(response.accessToken);
  };

  return (
    <div className="row d-flex text-center justify-content-center align-items-center my-0 mx-auto my-3">
      <div className="col-7">
        <div className="card h-100 welcome-container">
          <div className="loginDetails">
            Login with Facebook to give <strong>
              <a href="www.olla.ai" target='_blank' id='link-to-olla'>
              Olla AI
              </a> </strong>
              permission to access your
            Instagram Business Account's data
          </div>
        
          <br />
          <FacebookLogin
            appId="7130922673611664"
            autoLoad={true}
            fields="name,public_profile,picture"
            onClick={componentClicked}
            callback={responseFacebook}
          />
        </div>
      </div>
    </div>
  );
};

render(<LoginButton />, document.querySelector("#root"));

export default LoginButton;
