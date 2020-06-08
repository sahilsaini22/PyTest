import React from 'react';

const NowPlaying = (props) => {
    let nowPlaying = props.queue[props.nowPlaying];
    if (nowPlaying) {
        let queue = props.queue.map(({_id, title, year}) => 
            <li className="list-group-item list-group-item-action" key={_id}>
                {title} ({year})
            </li>        
        );
        return (
            <nav
                className="navbar navbar-expand-lg navbar-light bg-light fixed-bottom d-block"
                // style="position: fixed; bottom: 0; width: 100%; z-index: 99999"
            >
                <div className="container">
                    <div>Now playing: {nowPlaying.title}</div>
                </div> 
                <div className="container">
                    <div>
                        <ul className="list-group list-group-horizontal overflow-auto">
                            {queue}
                        </ul>
                    </div>

                    {/* {{#if nowPlaying}}
                    <p>nowPlaying: {{ nowPlaying }}</p>
                    {{/if}}
                    <p>Now Playing: {{queue.0.title}} ({{queue.0.year}})</p> */}
                </div> 
            </nav>
        );
    } else {
        return null;
    }
}

export default NowPlaying;