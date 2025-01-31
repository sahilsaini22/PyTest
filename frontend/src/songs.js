import React from 'react';

const Songs = (props) => {
    if (props) {
        let likedSongs;
        if (props.likedSongs && props.likedSongs.length > 0) {
            likedSongs = props.likedSongs.map((Song) => 
                <li className="list-group-item list-group-item-action" key={Song}>
                    {Song}
                </li>        
            );
        }

        let songs = props.songs.map(({_id, Song, Year}) => 
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
                    props.queue && props.queue.length > 0 ?
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {props.handleAddToQueue(_id, Song)}}
                    >
                        add to queue
                    </button>
                    : null
                }
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
            <>
                <div className="py-3">
                    <h2>Play songs</h2>
                    <ul className="list-group list-group-horizontal overflow-auto">
                        {songs}
                    </ul>
                </div>
                {
                    props.likedSongs && props.likedSongs.length > 0 ?
                    <>
                        <h2>Playlist: your liked songs</h2>
                        <ul className="list-group list-group-horizontal overflow-auto">
                            {likedSongs}
                        </ul>
                    </>
                    : null              
                }
                {
                    !props.userDetails ? 
                    <div className="py-3">
                        <h3>Register now to get song recommendations and more!</h3>
                    </div>
                    : null
                }        
            </>

        );
    } else {
        return null;
    }
}

export default Songs;