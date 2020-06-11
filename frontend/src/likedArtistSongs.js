import React from 'react';

const LikedArtistSongs = (props) => {
    console.log(props)
    if (props.likedArtistSongs.length > 0) {
        let songs = props.likedArtistSongs.map(Song => 
            <li className="list-group-item list-group-item-action" key={Song}>
                {Song}
            </li>        
        );
        
        return (
            <div className="py-3">
                <h2>Discover songs based on artists you like</h2>
                <ul className="list-group list-group-horizontal overflow-auto">
                    {songs}
                </ul>
            </div>
        );
    } else {
        return null;
    }
}

export default LikedArtistSongs;