import React from 'react';

const TrendingArtists = (props) => {
    if (props.userDetails && props.trendingArtists && props.trendingArtists.length > 0) {
        let trendingArtists = props.trendingArtists.map((artist) => 
            <li className="list-group-item list-group-item-action" key={artist}>
                {artist}
            </li>        
        );
        
        return (
            <div className="py-3">
                <h2>Top 10 Trending Artists</h2>
                <ul className="list-group list-group-horizontal overflow-auto">
                    {trendingArtists}
                </ul>
            </div> 
        );
    } else {
        return null;
    }
}

export default TrendingArtists;