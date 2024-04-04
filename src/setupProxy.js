// imports here
const { createProxyMiddleware } = require('http-proxy-middleware');
/**
 * Proxying Backend Requests
 * During DEV Phase:, REACT app and BACKEND run on diff ports (client = 3000, backend = 5000)
 * Tell React App to find the Server when doing API calls for token or login (use a PROXY)
 * 
 * Ensures ALL petitions with the /auth/** pattern will be redirected to the backend 
 */
module.exports = function (app) { 
    app.use('auth/**',
        createProxyMiddleware({
            target: 'http://localhost:5000'
        })
    );
};