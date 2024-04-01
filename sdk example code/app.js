// // imports/requires HERE
// const dotenvConfig = require('dotenv').config()
// console.log(`my secret: ${process.env.ACCESS_TOKEN}`)
// // const express = require('express');
// // const app = express();
// // const port = 3000;

// app.listen(port, () => {
    // console.log(`Example app listening on port: localhost:${port}`);
// });

/**
 * INITIALIZE THE PLAYER method
 * Takes in:
 * 1) 'name' of spotify instance
 * 2) callback func 'getOAuthToken' w/ client secret
 * 3) 'volume' of player
 */
window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQAqJf0TptdbH-7K3LAnMbTNSS7KX0V_zcbklvNRas67KmB1HfBbYuvGXanMQTmPsFHFDQD_t2MhJ4smGt0zF1_038iaCypP4pkIAOskd3mxI6RSrHU7L0XcNX_iTj7uZ5NmWA2XjU3kfEVWJA_j74IFQ6imKDevASnRp_UlW_NcBFIuo0kFd4qD3hSJeWyFWjAx5Xti9g';
    const player = new Spotify.Player({
        name: 'Kevin SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    /**
     * CHECK IF ERROR HAPPENS DURING SDK INIT
     * 1) init error
     * 2) auth error
     * 3) acct error
     */
    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    // run this when button is clicked
    document.getElementById('togglePlay').onclick = function () {
        player.togglePlay();
    };

    // CONNECT
    player.connect();
}

