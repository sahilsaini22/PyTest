import React from 'react';

const Songs = (props) => {
    if (props) {
        let songs = props.songs.map(({_id, title, year}) => 
            <li className="list-group-item list-group-item-action" key={_id}>
                {title} ({year})
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {props.handlePlay(_id)}}
                >
                    play
                </button>
                <button
                    type="button"
                    className="btn btn-outline-success"
                    href={'/like/' + _id}
                >
                    like
                </button>
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
    }
}

export default Songs;