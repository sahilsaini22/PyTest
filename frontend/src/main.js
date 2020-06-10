import React, { Component } from 'react';
import Navbar from './navbar.js';
import NowPlaying from './nowPlaying.js';
import Songs from './songs.js';
import TrendingSongs from './trendingSongs.js';
import RegisterModal from './registerModal.js';
import LoginModal from './loginModal.js';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: [],
            trendingSongs: [],
            queue: [],
            nowPlaying: null,
            userId: 'guest',
            userDetails: null
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        await this.getCurrentUser();
        await this.getSongs();
        await this.getTrendingSongs();
        await this.getQueue();
        await this.getNowPlaying();    
    }

    getUserToken = () => {
        return localStorage.getItem('token');
    };

    getCurrentUser = () => {
        return new Promise(resolve => {
            let token = this.getUserToken();
            if (token) {
                let body = JSON.stringify({
                    token: token
                });
                fetch('http://localhost:4000/currentUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: body
                })
                .then(response => response.json())
                .then(response => {
                    this.setState({
                        userId: response.data._id,
                        userDetails: response.data
                    }, () => { resolve() });
                })
                .catch(err => {
                    console.error(err);
                    resolve();
                });    
            }
            resolve();    
        });
    }

    getSongs = () => {
        return new Promise(resolve => {
            fetch('http://localhost:4000/songs')
            .then(response => response.json())
            .then(response => {
                // console.log(response);
                this.setState({ songs: response.data }, () => { resolve() });
            })
            .catch(err => {
                console.error(err);
                resolve();
            });    
        });
    }

    getTrendingSongs = () => {
        return new Promise(resolve => {
            fetch('http://localhost:4000/trendingSongs')
            .then(response => response.json())
            .then(response => this.setState({ trendingSongs: response.data }, () => { resolve() }))
            .catch(err => {
                console.error(err);
                resolve();
            });    
        })
    }

    getQueue = () => {
        return new Promise (resolve => {
            fetch(`http://localhost:4000/queue/${this.state.userId}`)
            .then(response => response.json())
            .then(response => {
                this.setState({ queue: response.data }, () => { resolve() })
            })
            .catch(err => {
                console.error(err);
                resolve();
            });    
        });
    }

    getNowPlaying = () => {
        return new Promise (resolve => {
            fetch(`http://localhost:4000/nowPlaying/${this.state.userId}`)
            .then(response => response.json())
            .then(response => {
                this.setState({ nowPlaying: response.data }, () => { resolve() })
            })
            .catch(err => {
                console.error(err);
                resolve();
            });    
        })
    }

    handlePlay = (songId) => {
        let body = JSON.stringify({
            _songId: songId,
            _userId: this.state.userId,
            nowPlaying: this.state.nowPlaying
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
            this.setState({ nowPlaying: response.data }, async () => {
                await this.getQueue();
                await this.getTrendingSongs();
            })
        })
        .catch(err => console.error(err));
    }

    handleSkip = (songId) => {
        let body = JSON.stringify({
            _songId: songId,
            _userId: this.state.userId,
            nowPlaying: this.state.nowPlaying
        });

        fetch('http://localhost:4000/skip', {
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
    }

    handlePrevious = (songId) => {
        let body = JSON.stringify({
            _songId: songId,
            _userId: this.state.userId,
            nowPlaying: this.state.nowPlaying
        });

        fetch('http://localhost:4000/previous', {
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
    }

    handleRegister = (registerData) => {
        let body = JSON.stringify({
            username: registerData.username,
            password: registerData.password,
            role: registerData.role,
            country: registerData.country
        });

        fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            this.setState({
                userId: response.data._id,
                userDetails: response.data
            }, () => {
                fetch('http://localhost:4000/neoUserAdd', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: body
                })
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    window.$('#registerModal').modal('hide');
                })
                .catch(err => console.error(err));
            });
        })
        .catch(err => console.error(err));
    }

    handleLogin = (loginData) => {
        let body = JSON.stringify({
            username: loginData.username,
            password: loginData.password
        });

        fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
        .then(response => response.json())
        .then(response => {
            if (response.result === "success") {
                localStorage.setItem("token", response.token);
                this.setState({
                    userId: response.payload._id,
                    userDetails: response.payload
                }, () => {
                    window.$('#loginModal').modal('hide');
                });    
            } else {
                window.alert(response.message);
            }
        })
        .catch(err => console.error(err));
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        this.setState({
            userId: 'guest',
            userDetails: null
        });
    }

    render() {
        return (
            <>
                <Navbar
                    userId={this.state.userId}
                    userDetails={this.state.userDetails}
                    handleLogout={this.handleLogout}
                />
                <RegisterModal handleRegister={this.handleRegister} />
                <LoginModal handleLogin={this.handleLogin} />
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
                    handleSkip={this.handleSkip}
                    handlePrevious={this.handlePrevious}
                />
            </>
        );
    }
}

export default Main;