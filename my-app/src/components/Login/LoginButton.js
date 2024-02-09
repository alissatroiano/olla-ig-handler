/* global FB */

import React from "react";

class LoginButton extends React.Component {
  componentDidMount() {
    // Initialize Facebook SDK when component mounts
    this.initializeFacebookSDK();
  }

  initializeFacebookSDK() {
    window.fbAsyncInit = function () {
      FB.init({
        appId: "",
        xfbml: true,
        version: "v19.0",
      });

      FB.getLoginStatus(
        function (response) {
          this.statusChangeCallback(response); // Call statusChangeCallback function
        }.bind(this)
      );

      FB.login(function (response) {
        if (response.authResponse) {
          console.log("Welcome! Fetching your information....");
          FB.api("/me", { fields: "name, email" }, function (response) {
            // Update UI with user information
            document.getElementById("profile").innerHTML =
              "OLLA, " + response.name + "! It's good to see you :)";
          });
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      });
    }.bind(this);

    // Load Facebook SDK script
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }

  statusChangeCallback(response) {
    console.log("Facebook login status:", response.status);
    if (response.status === "connected") {
      // User is logged into Facebook and your app
      console.log("User is logged into Facebook and your app.");
    } else if (response.status === "not_authorized") {
      // User is logged into Facebook but has not authorized your app
      console.log(
        "User is logged into Facebook but has not authorized your app."
      );
    } else {
      // User is not logged into Facebook
      console.log("User is not logged into Facebook.");
    }
  }

  render() {
    return (
      <button id="get-started-button" className="login-button">
        Connect with Facebook
      </button>
    );
  }
}

export default LoginButton;
