import React, { Component } from 'react';
import AppNavbar from './components/auth/AppNavbar.js';
import Tracks from './components/Tracks.js';
import { Provider } from 'react-redux';
import store from './store';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: [],
            trendingSongs: [],
            queue: [],
            nowPlaying: null
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
        fetch('http://localhost:4000/queue')
        .then(response => response.json())
        .then(response => this.setState({ queue: response.data }))
        .catch(err => console.error(err));
    }

    getNowPlaying = () => {
        fetch('http://localhost:4000/nowPlaying')
        .then(response => response.json())
        .then(response => this.setState({ nowPlaying: response.data }))
        .catch(err => console.error(err));
    }

    handlePlay = (id) => {
        fetch(`http://localhost:4000/play/${id}`)
        .then(response => response.json())
        .then(response => this.setState({ nowPlaying: response.data }))
        .catch(err => console.error(err));
        this.getQueue();
    }
    
    render() {
       // const { isAuthenticated, user, country } = this.props.auth;        

        return (
            <>
                <Provider store={store}> 
                    <AppNavbar />
                    <Tracks
                        songs={this.state.songs}
                        trendingSongs={this.state.trendingSongs}
                        queue={this.state.queue}
                        nowPlaying={this.state.nowPlaying}
                        handlePlay={this.handlePlay}
                    />
                </Provider>
            </>
        );
    }
}

export default Main;