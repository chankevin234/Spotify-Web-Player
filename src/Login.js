/**
 * The login screen = one single button inviting users to log in. 
 * The component will perform a GET operation to /auth/login to start the authentication flow.
 * @returns <Login Component>
 */

import React from 'react';

function Login() {
    return (
        <div className="App">
            <header className="App-header">
                <a className="btn-spotify" href="/auth/login" >
                    Login with Spotify 
                </a>
            </header>
        </div>
    );
}

export default Login;
