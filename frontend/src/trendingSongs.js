import React from 'react';

const TrendingSongs = (props) => {
    if (props) {
        let trendingSongs = props.trendingSongs.map(({_id, title, year}) => 
            <li class="list-group-item list-group-item-action" key={_id}>
                {title} ({year})
                <p><a href={'/play/' + _id}>play</a> <a href={'/like/' + _id}>like</a></p>
            </li>        
        );
        
        return (
            <div class="py-3">
                <h2>Top 10 Trending Songs</h2>
                <ul class="list-group list-group-horizontal overflow-auto">
                    {trendingSongs}
                </ul>
            </div> 
        );
    }
}

export default TrendingSongs;