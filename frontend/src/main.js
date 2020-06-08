import React, { Component } from 'react';
import Navbar from './navbar.js';
import NowPlaying from './nowPlaying.js';
import Songs from './songs.js';
import TrendingSongs from './trendingSongs.js';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: [],
            trendingSongs: [],
            queue: [],
            nowPlaying: null,
            userId: 'guest'
        };
    }

    componentDidMount() {
        this.getSongs();
        this.getTrendingSongs();
        this.getQueue();
        this.getNowPlaying();
    }

    getSongs = () => {
        fetch('http://localhost:4000/songs')
        .then(response => response.json())
        .then(response => this.setState({ songs: response.data }))
        .catch(err => console.error(err));
    }

    getTrendingSongs = () => {
        fetch('http://localhost:4000/trendingSongs')
        .then(response => response.json())
        .then(response => this.setState({ trendingSongs: response.data }))
        .catch(err => console.error(err));
    }

    getQueue = () => {
        fetch(`http://localhost:4000/queue/${this.state.userId}`)
        .then(response => response.json())
        .then(response => {
            this.setState({ queue: response.data })
        })
        .catch(err => console.error(err));
    }

    getNowPlaying = () => {
        fetch(`http://localhost:4000/nowPlaying/${this.state.userId}`)
        .then(response => response.json())
        .then(response => {
            this.setState({ nowPlaying: response.data })
        })
        .catch(err => console.error(err));
    }

    handlePlay = (songId) => {
        let body = JSON.stringify({
            _songId: songId,
            _userId: this.state.userId
        });

        fetch('http://localhost:4000/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
        .then(response => response.json())
        .then(response => {
            this.setState({ nowPlaying: response.data })
        })
        .catch(err => console.error(err));
        this.getQueue();
    }

    render() {
        return (
            <>

                <Navbar />

                <div className="container pb-56">
                    {/* <!-- {{#if queue}}
                    <div className="py-3">
                        <h2>Play Queue</h2>
                        <ul className="list-group list-group-horizontal overflow-auto">
                            {{#each queue}}
                            <li className="list-group-item list-group-item-action">
                                {{this.title}} ({{this.year}})
                            </li>
                            {{/each}}
                        </ul>
                    </div>
                    {{/if}} --> */}

                    <Songs
                        songs={this.state.songs}
                        handlePlay={this.handlePlay}
                    />
                    <TrendingSongs trendingSongs={this.state.trendingSongs} />
                </div>

                <NowPlaying
                    nowPlaying={this.state.nowPlaying}
                    queue={this.state.queue}
                />
            </>
        );
    }
}

export default Main;