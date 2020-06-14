import React from 'react';

const TrendingSongs = (props) => {
    if (props.userDetails && props.trendingSongs.length > 0) {
        let trendingSongs = props.trendingSongs.map(({_id, Song, Year}) => 
            <li className="list-group-item list-group-item-action" key={_id}>
                {Song} ({Year})
                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {props.handlePlay(_id, Song)}}
                >
                    play
                </button>
                {
                    props.userDetails ? 
                    <button
                        type="button"
                        className={props.likedSongs.includes(Song) ? "btn btn-success btn-sm" : "btn btn-outline-success btn-sm"}
                        onClick={() => {
                            props.likedSongs.includes(Song) ? props.handleRemoveLike(_id, Song) : props.handleLike(_id, Song)}
                        }
                    >
                        {props.likedSongs.includes(Song) ? "liked" : "like"}
                    </button>
                    : null
                }
            </li>        
        );
        
        return (
            <div className="py-3">
                <h2>Top 10 trending songs</h2>
                <ul className="list-group list-group-horizontal overflow-auto">
                    {trendingSongs}
                </ul>
            </div> 
        );
    } else {
        return null;
    }
}

export default TrendingSongs;