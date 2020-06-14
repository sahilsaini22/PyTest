import React from 'react';

const Discovery = (props) => {
    console.log(props)

    let likedArtistSongs, topSongsCountry;
    if (props.userDetails && props.likedArtistSongs && props.likedArtistSongs.length > 0) {
        likedArtistSongs = props.likedArtistSongs.map(Song => 
            <li className="list-group-item list-group-item-action" key={Song}>
                {Song}
            </li>        
        );
    } 
    if (props.userDetails && props.topSongsCountry && props.topSongsCountry.length > 0) {
        topSongsCountry = props.topSongsCountry.map(Song => 
            <li className="list-group-item list-group-item-action" key={Song}>
                {Song}
            </li>        
        );
    } 
    
    return (
        <> 
            {
                likedArtistSongs ? 
                <div className="py-3">
                    <h2>Discover songs based on artists of songs you like</h2>
                    <ul className="list-group list-group-horizontal overflow-auto">
                        {likedArtistSongs}
                    </ul>
                </div>
                : null
            }
            {
                topSongsCountry ? 
                <div className="py-3">
                    <h2>Discover top 10 liked songs in {props.userDetails.country}</h2>
                    <ul className="list-group list-group-horizontal overflow-auto">
                        {topSongsCountry}
                    </ul>
                </div>
                : null
            }
        </>
    );
}

export default Discovery;