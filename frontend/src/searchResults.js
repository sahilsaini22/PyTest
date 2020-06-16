import React, { Component } from 'react';

class SearchResults extends Component {
    render() {
        let query = this.props.query;
        let resultSongs = this.props.resultSongs;
        let resultArtistSongs = this.props.resultArtistSongs;
        let resultGenreSongs = this.props.resultGenreSongs;
        let songs, artistSongs, genreSongs;

        if (resultSongs && resultSongs.length > 0 && query !== '') {
            songs = resultSongs.map(({_id, Song, Year}) => 
                <li className="list-group-item list-group-item-action" key={_id}>
                    {Song} ({Year})
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {this.props.handlePlay(_id, Song)}}
                    >
                        play
                    </button>
                    {
                        this.props.userDetails ? 
                        <button
                            type="button"
                            className={this.props.likedSongs.includes(Song) ? "btn btn-success btn-sm" : "btn btn-outline-success btn-sm"}
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
        }

        if (resultArtistSongs && resultArtistSongs.length > 0 && query !== '') {
            artistSongs = resultArtistSongs.map(({_id, Song, Year}) => 
                <li className="list-group-item list-group-item-action" key={_id}>
                    {Song} ({Year})
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {this.props.handlePlay(_id, Song)}}
                    >
                        play
                    </button>
                    {
                        this.props.userDetails ? 
                        <button
                            type="button"
                            className={this.props.likedSongs.includes(Song) ? "btn btn-success btn-sm" : "btn btn-outline-success btn-sm"}
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
        }

        if (resultGenreSongs && resultGenreSongs.length > 0 && query !== '') {
            genreSongs = resultGenreSongs.map(({_id, Song, Year}) => 
                <li className="list-group-item list-group-item-action" key={_id}>
                    {Song} ({Year})
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {this.props.handlePlay(_id, Song)}}
                    >
                        play
                    </button>
                    {
                        this.props.userDetails ? 
                        <button
                            type="button"
                            className={this.props.likedSongs.includes(Song) ? "btn btn-success btn-sm" : "btn btn-outline-success btn-sm"}
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
        }

        return (
            query !== '' ?
                <div className="my-4 py-3 px-3 bg-gainsboro rounded-lg">
                    {
                        songs || artistSongs || genreSongs ?
                        <h2>Search results for "{query}"</h2> 
                        :
                        query !== '' ?
                        <h2>No search results found for "{query}"</h2> 
                        :
                        null
                    }
                    {
                        songs ?
                        <div className="py-3">
                            <h3>Song titles containing "{query}"</h3> 
                            <ul className="list-group list-group-horizontal overflow-auto">
                                {songs}
                            </ul>
                        </div>
                        : null
                    }
                    {
                        artistSongs ?
                        <div className="py-3">
                            <h3>Songs by {query}</h3> 
                            <ul className="list-group list-group-horizontal overflow-auto">
                                {artistSongs}
                            </ul>
                        </div>
                        : null
                    }
                    {
                        genreSongs ?
                        <div className="py-3">
                            <h3>Songs belonging to genre: {query}</h3> 
                            <ul className="list-group list-group-horizontal overflow-auto">
                                {genreSongs}
                            </ul>
                        </div>
                        : null
                    }
                </div>
            : null            
        );
    }
}

export default SearchResults;