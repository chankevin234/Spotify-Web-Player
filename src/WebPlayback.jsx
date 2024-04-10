import React, { useState, useEffect } from 'react';

// define the track JSON object
const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function WebPlayback(props) {
    /**
     * is_paused is a boolean variable that indicates whether the current track is being played or not.
     * is_active to indicate whether the current playback has been transferred to this player or not.
     * current_track, an object to store the currently playing track.
     */
    const [player, setPlayer] = useState(undefined); // determines if the player has casted to Spotify Player
    /**
     * Determines the play/stop/skip for the webplayer
     */
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Kevin Spotify Web App',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ((state) => {
                if (!state) {
                    return;
                }
                console.log('track:');
                console.log(state.track_window.current_track);

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then((state) => {
                    if (!state) {
                        console.error('User is not playing music through the Web Playback SDK');
                        return;
                    }

                    var current_track = state.track_window.current_track;
                    var next_track = state.track_window.next_tracks[0];

                    console.log('Currently Playing', current_track);
                    console.log('Playing Next', next_track);

                    (!state) ? setActive(false) : setActive(true)
                });

            }));
            player.connect();
        };
    }, []);

    if (!is_active) {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">

                        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>

                            <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                                &lt;&lt;
                            </button>

                            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                {is_paused ? "PLAY" : "PAUSE"}
                            </button>

                            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                &gt;&gt;
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

export default WebPlayback;