import './App.css';
import React from "react";
// import env from "react-dotenv";
import LoginButton from '../Login/LoginButton';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
           <code> ALISSA</code> TROIANO
        </p>
        <a
          className="App-link"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div className="container-fluid">
        <div className="App">
          <div className="row d-flex">
            <div className="col-12">
              <LoginButton />
              <div id="profile"></div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
