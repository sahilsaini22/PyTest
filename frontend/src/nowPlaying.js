import React from 'react';

const NowPlaying = (props) => {
    let nowPlaying = props.queue[props.nowPlaying];
    if (nowPlaying) {
        let queue = props.queue.map(({_id, Song, Year}, index) => 
            <li className="list-group-item list-group-item-action" key={_id + index}>
                {Song} ({Year})
            </li>        
        );

        let history = props.history.map(({_id, Song, Year}, index) => 
            <li className="list-group-item list-group-item-action" key={_id + index}>
                {Song} ({Year})
            </li>        
        );

        let skipButton = parseInt(props.nowPlaying) < props.queue.length - 1 ? (
            <button
                type="button"
                className="btn btn-outline-secondary btn-sm ml-2"
                onClick={() => {props.handleSkip(nowPlaying._id, nowPlaying.Song)}}
            >
                skip
            </button>
        ) : null;

        let previousButton = parseInt(props.nowPlaying) > 0 ? (
            <button
                type="button"
                className="btn btn-outline-secondary btn-sm mr-2"
                onClick={() => {props.handlePrevious(nowPlaying._id)}}
            >
                previous
            </button>
        ) : null;

        return (
            <nav
                className="navbar navbar-expand-lg navbar-light bg-light fixed-bottom d-block"
                // style="position: fixed; bottom: 0; width: 100%; z-index: 99999"
            >
                <div className="container">
                    <div>
                        {previousButton}
                        Now playing: {nowPlaying.Song}
                        {skipButton}
                    </div>
                </div> 
                <div className="container">
                    <ul className="list-group list-group-horizontal overflow-auto my-1">
                        Play queue: {queue}
                    </ul>
                    {/* {{#if nowPlaying}}
                    <p>nowPlaying: {{ nowPlaying }}</p>
                    {{/if}}
                    <p>Now Playing: {{queue.0.Song}} ({{queue.0.Year}})</p> */}
                </div> 
                <div className="container">
                    <ul className="list-group list-group-horizontal overflow-auto my-1">
                        Play history: {history}
                    </ul>
                </div>
            </nav>
        );
    } else {
        return null;
    }
}

export default NowPlaying;