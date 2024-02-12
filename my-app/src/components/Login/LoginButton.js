import React, { useState } from "react";
import { render } from "react-dom";
import FacebookLogin from 'react-facebook-login'


const LoginButton = () => {
  const [accessToken, setAccessToken] = useState("");

  const componentClicked = data => {
    console.log("data", data);
  };

const responseFacebook = response => {
    // console.log(response.accessToken);
    setAccessToken(response.accessToken);
  }

  return (
    <div>
          Login with Facebook
          <br />
          User Short-Lived Access Token:
          {accessToken}
          <FacebookLogin
            appId="7130922673611664"
            autoLoad={true}
            fields="name,public_profile,picture"
            onClick={componentClicked}
            callback={responseFacebook} 
          />
    </div>
  );
}

render(<LoginButton />, document.querySelector('#root'));

export default LoginButton;