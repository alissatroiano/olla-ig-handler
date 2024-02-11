import React, { useState } from "react";
import { render } from "react-dom";
import FacebookLogin from 'react-facebook-login'


const LoginButton = () => {
  const componentClicked = data => {
    console.log("data", data);
  };

const responseFacebook = response => {
    console.log(response);
  }

  return (
    <div>
          Connect with Facebook
          <br />
          <FacebookLogin
            appId=""
            autoLoad={true}
            fields="name,public_profile"
            onClick={componentClicked}
            callback={responseFacebook} 
          />
    </div>
  );
}

render(<LoginButton />, document.querySelector('#root'));

export default LoginButton;