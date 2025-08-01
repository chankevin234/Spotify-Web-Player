/**
 * The Server is used to export some basic endpoints to the frontend corresponding to the steps of the authorization flow:
 *  /auth/login to request user authorization by getting an Authorization Code.
 *  /auth/callback to request the Access Token using the Authorization Code requested in the previous step
 */
const express = require('express'); // receive and handle all incoming requests to the server.
const dotenv = require('dotenv'); // access env variables
const request = require('request'); // used for POST HTTP calls
var querystring = require('querystring');

// set localhost port
const port = 5000;

global.access_token = ''

// retrieve .env values HERE
dotenv.config()
var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var spotify_redirect_uri = 'http://localhost:3000/auth/callback'

// generate the random string for STATE that needs to be passed into authorization endpoint
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// AUTHORIZATION FLOW BELOW
var app = express();
// app.use(express.static(path.join(__dirname, '../build'))); //From now on, we can run the server and load files directly from the server

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

/**
 * STEP 1: Request User Authorization 
 *  - Redirect the user to web page where they can choose to grant our application access to their premium account.
 *  - send a GET to the Spotify's /authorize endpoint (5 params):
 *      1) scope = actions app can do on user's behalf
 *      2) state = random string for security purposes
 *      3) response_type = credential that will be returned.
 *      4) client_id = client id of app
 *      5) redirect_uri = URL you are redirected after access token is granted 
 */
app.get('/login', (req, res) => {
  console.log(spotify_client_id, spotify_client_secret)

  var scope = "streaming user-read-email user-read-private"

  var state = generateRandomString(16);

  var auth_query_parameters = querystring.stringify({
    response_type: 'code',
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state
  })

  // console.log(auth_query_parameters.toString());
  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters);
  // console.log("You have successfully logged into the OAuth page!")
});
/**
 * STEP 2: Request Access Token
 *  Use the acquired auth code to get an Access Token and make a POST req to /api/token endpoint (3 params):
 *  1) grant_type = value of 'authorization_code'
 *  2) code = auth code
 *  3) redirect_uri
 */
app.get('/callback', (req, res) => {
  console.log("Requesting http://localhost:3000/auth/callback");

  var code = req.query.code;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };

  console.log("POSTING!", authOptions);
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("No Error _ statuscode 200!");
      access_token = body.access_token;
      console.log(access_token);
      res.redirect('/')
    }
  });

})
/**
 * STEP 3: Return Access Token
 *  - sent to /auth/token endpoint
 */
app.get('/token', (req, res) => {
  console.log("Refreshing Token!");
  res.json({ access_token: access_token })
})

// app.get('/', (req, res) => {
//   console.log('ROOT response!');
//   res.send('ROOT/HOME! Root response!!')
// });

// app.get('*', (req, res) => {
//   res.send('UNKNOWN PATH!');
// });