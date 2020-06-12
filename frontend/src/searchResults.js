import React, { Component } from 'react';

class SearchResults extends Component {
    render() {
        let query = this.props.query;
        let resultSongs = this.props.resultSongs;
        if (resultSongs && resultSongs.length > 0 && query !== '') {
            let songs = resultSongs.map(({_id, Song, Year}) => 
                <li className="list-group-item list-group-item-action" key={_id}>
                    {Song} ({Year})
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => {this.props.handlePlay(_id, Song)}}
                    >
                        play
                    </button>
                    {
                        this.props.userDetails ? 
                        <button
                            type="button"
                            className={this.props.likedSongs.includes(Song) ? "btn btn-success" : "btn btn-outline-success"}
                            onClick={() => {
                                this.props.likedSongs.includes(Song) ? this.props.handleRemoveLike(_id, Song) : this.props.handleLike(_id, Song)}
                            }
                        >
                            {this.props.likedSongs.includes(Song) ? "liked" : "like"}
                        </button>
                        : null
                    }
                </li>        
            );
            
            return (
                <div className="py-3">
                    <h2>Search results for "{query}"</h2>
                    <ul className="list-group list-group-horizontal overflow-auto">
                        {songs}
                    </ul>
                </div>
            );
        } else if (resultSongs.length === 0 && query !== '') {
            return (
                <div className="py-3">
                    <h2>No search results found for "{query}"</h2>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default SearchResults;