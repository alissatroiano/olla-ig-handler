import './App.css';
import React from "react";
// import env from "react-dotenv";
import LoginButton from '../Login/LoginButton';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">
       Welcome to Olla AI 
        </h1>
      </header>
      <div className="container-fluid">
        <div className="App">
          <div className="row text-center d-flex">
            <div className="col-12 my-3 pt-2">
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
