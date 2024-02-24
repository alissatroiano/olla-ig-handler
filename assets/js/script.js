function initializeFacebookSDK() {
  (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk')
  );
  window.fbAsyncInit = function () {

      FB.init({
          appId: '7130922673611664',
          xfbml: true,
          version: 'v19.0'
      });
      FB.getLoginStatus(function(response) {
          statusChangeCallback(response);
      });
      FB.login(function (response) {
          if (response.authResponse) {
              console.log('Welcome!  Fetching your information.... ');
              FB.api('/me', { fields: 'name, email' }, function (response) {
                  document.getElementById("profile").innerHTML = "Good to see you, " + response.name + ". i see your email address is " + response.email
              });
          } else {
              console.log('User cancelled login or did not fully authorize.');
          }
      });
  };
}

document.getElementById("get-started-button").addEventListener("click", function () {
  initializeFacebookSDK();
});
