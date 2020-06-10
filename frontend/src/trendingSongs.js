import React from 'react';

const TrendingSongs = (props) => {
    if (props.userDetails) {
        let trendingSongs = props.trendingSongs.map(({_id, Song, Year}) => 
            <li className="list-group-item list-group-item-action" key={_id}>
                {Song} ({Year})
                <p><a href={'/play/' + _id}>play</a> <a href={'/like/' + _id}>like</a></p>
            </li>        
        );
        
        return (
            <div className="py-3">
                <h2>Top 10 Trending Songs</h2>
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