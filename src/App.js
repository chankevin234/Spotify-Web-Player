// IMPORTS HERE
import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';
import './App.css';

function App() {
  const [token, setToken] = useState('');

  // useEffect hook sends a GET request to the /auth/token endpoint to check if we have a valid access_token already requested
  useEffect(() => {
    console.log("APP.JS useEffect()!");
    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      setToken(json.access_token); // access_token is stored using the setToken()
      console.log(json.access_token);
    }

    getToken(); // actual run here
  }, []);

  /**
   * Login component will be loaded IF access_token is still EMPTY.
   * IF access_token already requested (active session ongoing), WebPlayback component loads
   */
  return (
    <>
      {(token === '') ? <Login /> : <WebPlayback token={token} />}
    </>
  );
}

export default App;
