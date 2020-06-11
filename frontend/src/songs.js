import React from 'react';

const Songs = (props) => {
    if (props) {
        let songs = props.songs.map(({_id, Song, Year}) => 
            <li className="list-group-item list-group-item-action" key={_id}>
                {Song} ({Year})
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {props.handlePlay(_id)}}
                >
                    play
                </button>
                {
                    props.userDetails ? 
                    <button
                        type="button"
                        className={props.likedSongs.includes(Song) ? "btn btn-success" : "btn btn-outline-success"}
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
                <h2>Play songs</h2>
                <ul className="list-group list-group-horizontal overflow-auto">
                    {songs}
                </ul>
            </div>
        );
    } else {
        return null;
    }
}

export default Songs;