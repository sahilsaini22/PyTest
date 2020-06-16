import React from 'react';

const SelectedGenreSongs = (props) => {
    let selectedGenreSongs;
    if (props.userDetails && props.selectedGenreSongs && props.selectedGenreSongs.length > 0) {
        selectedGenreSongs = props.selectedGenreSongs.map(Song => 
            <li className="list-group-item list-group-item-action" key={Song}>
                {Song}
            </li>        
        );
    } 
    
    return (
        <> 
            {
                selectedGenreSongs ? 
                <div className="py-3">
                    <h2>Songs based on genres you like</h2>
                    <ul className="list-group list-group-horizontal overflow-auto">
                        {selectedGenreSongs}
                    </ul>
                </div>
                : null
            }
        </>
    );
}

export default SelectedGenreSongs;