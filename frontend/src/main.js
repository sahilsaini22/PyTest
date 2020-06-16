import React, { Component } from 'react';
import Navbar from './navbar.js';
import NowPlaying from './nowPlaying.js';
import Songs from './songs.js';
import TrendingSongs from './trendingSongs.js';
import TrendingArtists from './trendingArtists.js';
import RegisterModal from './registerModal.js';
import LoginModal from './loginModal.js';
import Users from './users.js';
import SearchResults from './searchResults.js';
import Discovery from './discovery.js';
import FollowedLikesSongs from './followedLikesSongs.js';
import SelectedGenreSongs from './selectedGenreSongs.js';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: [],
            trendingSongs: [],
            trendingArtists: [],
            queue: [],
            history: [],
            nowPlaying: null,
            userId: 'guest',
            userDetails: null,
            users: [],
            likedSongs: [],
            followedUsers: [],
            query: '',
            resultSongs: [],
            resultArtistSongs: [],
            resultGenreSongs: [],
            likedArtistSongs: [],
            likedGenreSongs: [],
            topSongsCountry: [],
            followedLikesSongs: [],
            selectedGenreSongs: []
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        await this.getCurrentUser();
        await this.getSongs();
        await this.getTrendingSongs();
        await this.getTrendingArtists();
        await this.getQueueAndHistory();
        await this.getNowPlaying();
        if (this.state.userDetails) {
            await this.getUsers();
            await this.getLikedSongs();
            await this.getSelectedGenreSongs();
            await this.getFollowedUsers();      
            await this.discoverLikedArtistSongs();    
            await this.discoverLikedGenreSongs();
            await this.discoverTopSongsCountry();  
            await this.getFollowedLikesSongs();
        }
    }

    getSongArtist = (song) => {
        return new Promise(resolve => {
            fetch(`http://localhost:4000/songArtist/${song}`)
            .then(response => response.json())
            .then(response => { resolve(response.data) })
            .catch(err => {
                console.error(err);
                resolve();
            });        
        });
    };

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

    getUsers = () => {
        return new Promise(resolve => {
            fetch('http://localhost:4000/users')
            .then(response => response.json())
            .then(response => {
                // console.log(response);
                this.setState({ users: response.data }, () => { resolve() });
            })
            .catch(err => {
                console.error(err);
                resolve();
            });    
        });
    }

    getLikedSongs = () => {
        return new Promise(resolve => {
            let body = JSON.stringify({
                username: this.state.userDetails.username
            });
            fetch('http://localhost:4000/likedSongs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            })
            .then(response => {
                if (!response.ok) { console.error(response.message) }
                return response.json()
            })
            .then(response => {
                console.log(response);
                this.setState({ likedSongs: response.data }, () => { resolve() });
            })
            .catch(err => {
                console.error(err);
                resolve();
            });    
        });
    }

    getSelectedGenreSongs = () => {
        return new Promise(resolve => {
            let body = JSON.stringify({
                username: this.state.userDetails.username
            });
            fetch('http://localhost:4000/selectedGenreSongs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            })
            .then(response => {
                if (!response.ok) { console.error(response.message) }
                return response.json()
            })
            .then(response => {
                console.log(response);
                this.setState({ selectedGenreSongs: response.data }, () => { resolve() });
            })
            .catch(err => {
                console.error(err);
                resolve();
            });    
        });
    }

    getFollowedUsers = () => {
        return new Promise(resolve => {
            let body = JSON.stringify({
                username: this.state.userDetails.username
            });
            fetch('http://localhost:4000/followedUsers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.setState({ followedUsers: response.data }, () => { resolve() });
            })
            .catch(err => {
                console.error(err);
                resolve();
            });    
        });
    }

    getFollowedLikesSongs = () => {
        return new Promise(resolve => {
            let body = JSON.stringify({
                username: this.state.userDetails.username
            });
            fetch('http://localhost:4000/neoFollowedLikesSongs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.setState({ followedLikesSongs: response.data }, () => { resolve() });
            })
            .catch(err => {
                console.error(err);
                resolve();
            });    
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

    getTrendingArtists = () => {
        return new Promise(resolve => {
            fetch('http://localhost:4000/trendingArtists')
            .then(response => response.json())
            .then(response => this.setState({ trendingArtists: response.data }, () => {
                console.log(this.state.trendingArtists); 
                resolve();
            }))
            .catch(err => {
                console.error(err);
                resolve();
            });    
        })
    }

    getQueueAndHistory = () => {
        return new Promise (resolve => {
            fetch(`http://localhost:4000/queue/${this.state.userId}`)
            .then(response => response.json())
            .then(response => {
                this.setState({ queue: response.data }, () => {
                    fetch(`http://localhost:4000/history/${this.state.userId}`)
                    .then(response => response.json())
                    .then(response => {
                        this.setState({ history: response.data }, () => { resolve() })
                    })
                    .catch(err => {
                        console.error(err);
                        resolve();
                    });    
                })
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

    addToHistory = (songObject) => {
        return new Promise (resolve => {
            let body = JSON.stringify({
                _songId: songObject._id,
                _userId: this.state.userId
            });
            fetch('http://localhost:4000/addToHistory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            })
            .then(async (response) => {
                console.log(response);
                await this.getQueueAndHistory();
                resolve();
            })
            .catch(err => {
                console.error(err);
                resolve();
            });    
        })
    }

    discoverLikedArtistSongs = () => {
        return new Promise(resolve => {
            let body = JSON.stringify({
                username: this.state.userDetails ? this.state.userDetails.username : null
            });
            fetch('http://localhost:4000/discovery/artistSongs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            })
            .then(response => response.json())
            .then(response => {
                this.setState({ likedArtistSongs: response.data }, () => { resolve() });
            })
            .catch(err => {
                console.error(err);
                resolve();
            });    
        });
    }

    discoverLikedGenreSongs = () => {
        return new Promise(resolve => {
            let body = JSON.stringify({
                username: this.state.userDetails ? this.state.userDetails.username : null
            });
            fetch('http://localhost:4000/discovery/genreSongs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            })
            .then(response => response.json())
            .then(response => {
                this.setState({ likedGenreSongs: response.data }, () => { resolve() });
            })
            .catch(err => {
                console.error(err);
                resolve();
            });    
        });
    }

    discoverTopSongsCountry = () => {
        return new Promise(resolve => {
            let body = JSON.stringify({
                username: this.state.userDetails ? this.state.userDetails.username : null
            });
            fetch('http://localhost:4000/discovery/topSongsCountry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            })
            .then(response => response.json())
            .then(response => {
                console.log('top songs country: ' + response.data);
                this.setState({ topSongsCountry: response.data }, () => { resolve() });
            })
            .catch(err => {
                console.error(err);
                resolve();
            });    
        });
    }

    handlePlay = (songId, songName) => {
        let body = JSON.stringify({
            _songId: songId,
            _userId: this.state.userId,
            nowPlaying: this.state.nowPlaying
        });

        fetch('http://localhost:4000/play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
        .then(response => response.json())
        .then(response => {
            this.setState({ nowPlaying: response.data }, async () => {
                await this.getQueueAndHistory();
                await this.getTrendingSongs();
                await this.getSongArtist(songName).then((songArtists) => {
                    songArtists.forEach(songArtist => {                    
                        let incrementArtistBody = JSON.stringify({
                            artist: songArtist,
                            scoreIncrement: 1
                        });
                        fetch('http://localhost:4000/incrementArtistScore', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: incrementArtistBody
                        })
                        .then(response => {
                            if (!response.ok) { console.error(response.message) }
                            return response.json()
                        })
                        .then(async (response) => {
                            await this.getTrendingArtists();                            
                        })
                        .catch(err => {
                            console.error(err);
                        });    
                    });
                });
            })
        })
        .catch(err => console.error(err));
    }

    handleAddToQueue = (songId, songName) => {
        let body = JSON.stringify({
            _songId: songId,
            _userId: this.state.userId,
        });

        fetch('http://localhost:4000/addToQueue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
        .then(response => response.json())
        .then(response => {
            this.setState({ nowPlaying: response.data }, async () => {
                await this.getQueueAndHistory();
                await this.getTrendingSongs();
                await this.getSongArtist(songName).then((songArtists) => {
                    songArtists.forEach(songArtist => {                    
                        let incrementArtistBody = JSON.stringify({
                            artist: songArtist,
                            scoreIncrement: 1
                        });
                        fetch('http://localhost:4000/incrementArtistScore', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: incrementArtistBody
                        })
                        .then(response => {
                            if (!response.ok) { console.error(response.message) }
                            return response.json()
                        })
                        .then(async (response) => {
                            await this.getTrendingArtists();                            
                        })
                        .catch(err => {
                            console.error(err);
                        });    
                    });
                });
            })
        })
        .catch(err => console.error(err));
    }

    handleSkip = (songId, songName) => {
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
            this.setState({ nowPlaying: response.data }, async () => {
                await this.getSongArtist(songName).then(async (songArtists) => {
                    songArtists.forEach(songArtist => {                    
                        let incrementArtistBody = JSON.stringify({
                            artist: songArtist,
                            scoreIncrement: -1
                        });
                        fetch('http://localhost:4000/incrementArtistScore', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: incrementArtistBody
                        })
                        .then(response => {
                            if (!response.ok) { console.error(response.message) }
                            return response.json()
                        })
                        .then(async (response) => {
                            await this.getTrendingArtists();     
                        })
                        .catch(err => {
                            console.error(err);
                        });    
                    });
                    await this.addToHistory(this.state.queue[this.state.nowPlaying]);                           
                });
            })            
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
            this.setState({ nowPlaying: response.data }, async () => {
                await this.addToHistory(this.state.queue[this.state.nowPlaying]);                           
            })
        })
        .catch(err => console.error(err));
    }

    handleRegister = (registerData) => {
        let body = JSON.stringify({
            username: registerData.username,
            password: registerData.password,
            role: registerData.role,
            country: registerData.country,
            likedGenres: registerData.likedGenres
        });

        fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
        .then(response => {
            if (!response.ok) {
                response.json().then(error => {
                    console.error(error);
                    window.alert(error.message);    
                });
            } else {
                return response.json()
            }
        })
        .then(response => {
            if (response) {
                console.log(response);
                localStorage.setItem("token", response.token);
                this.setState({
                    userId: response.data._id,
                    userDetails: response.data
                }, async () => {
                    await this.getQueueAndHistory();
                    await this.getNowPlaying();
                    await this.getUsers();
                    await this.discoverTopSongsCountry();  
    
                    fetch('http://localhost:4000/neoUserAdd', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: body
                    })
                    .then(response => response.json())
                    .then(response => {
                        console.log(response);
                        if (registerData.likedGenres && registerData.likedGenres.length > 0) {
                            fetch('http://localhost:4000/neoGenreAdd', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: body
                            })
                            .then(response => response.json())
                            .then(async (response) => {
                                console.log(response);
                                await this.getSelectedGenreSongs();
                            })
                            .catch(err => console.error(err));    
                        }
                        window.$('#registerModal').modal('hide');
                    })
                    .catch(err => console.error(err));
                });    
            }
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
                }, async () => {
                    window.$('#loginModal').modal('hide');
                    await this.getQueueAndHistory();
                    await this.getNowPlaying();
                    await this.getLikedSongs();
                    await this.getSelectedGenreSongs();
                    await this.getUsers();
                    await this.getFollowedUsers();        
                    await this.discoverLikedArtistSongs();    
                    await this.discoverLikedGenreSongs();
                    await this.discoverTopSongsCountry();  
                    await this.getFollowedLikesSongs();
                });    
            } else {
                window.alert(response.message);
            }
        })
        .catch(err => console.error(err));
    }

    handleLike = (songId, songName) => {
        fetch(`http://localhost:4000/like/${songId}`)
        .then(response => {
            if (!response.ok) { console.error(response.message) }
            return response.json()
        })
        .then(async (response) => {
            await this.getSongArtist(songName).then((songArtists) => {
                songArtists.forEach(songArtist => {                    
                    let incrementArtistBody = JSON.stringify({
                        artist: songArtist,
                        scoreIncrement: 2
                    });
                    fetch('http://localhost:4000/incrementArtistScore', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: incrementArtistBody
                    })
                    .then(response => {
                        if (!response.ok) { console.error(response.message) }
                        return response.json()
                    })
                    .then(async (response) => {
                        await this.getTrendingArtists();         
                                     
                        let body = JSON.stringify({
                            username: this.state.userDetails.username,
                            song: songName
                        });
                        fetch('http://localhost:4000/likeSong', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: body
                        })
                        .then(response => {
                            if (!response.ok) { console.error(response.message) }
                            return response.json()
                        })
                        .then(response => {
                            this.setState((state) => ({
                                likedSongs: [...state.likedSongs, songName]
                            }), async () => {
                                console.log(this.state.likedSongs);
                                await this.getTrendingSongs();
                                await this.discoverLikedArtistSongs();
                                await this.discoverLikedGenreSongs();
                                await this.discoverTopSongsCountry();  
                            });
                        })
                        .catch(err => {
                            console.error(err);
                        });    
                    })
                    .catch(err => {
                        console.error(err);
                    });    
                });
            });
        })
        .catch(err => {
            console.error(err);
        });  
    }

    handleRemoveLike = (songId, songName) => {
        fetch(`http://localhost:4000/removeLike/${songId}`)
        .then(response => {
            if (!response.ok) { console.error(response.message) }
            return response.json()
        })
        .then(async (response) => {
            await this.getSongArtist(songName).then((songArtists) => {
                songArtists.forEach(songArtist => {                    
                    let incrementArtistBody = JSON.stringify({
                        artist: songArtist,
                        scoreIncrement: -2
                    });
                    fetch('http://localhost:4000/incrementArtistScore', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: incrementArtistBody
                    })
                    .then(response => {
                        if (!response.ok) { console.error(response.message) }
                        return response.json()
                    })
                    .then(async (response) => {
                        await this.getTrendingArtists();   
                          
                        let body = JSON.stringify({
                            username: this.state.userDetails.username,
                            song: songName
                        });
                        fetch('http://localhost:4000/removeLikeSong', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: body
                        })
                        .then(response => {
                            if (!response.ok) { console.error(response.message) }
                            return response.json()
                        })
                        .then(response => {
                            this.setState((state) => ({
                                likedSongs: state.likedSongs.filter(song => song !== songName)
                            }), async () => {
                                console.log(this.state.likedSongs);
                                await this.getTrendingSongs();
                                await this.discoverLikedArtistSongs();
                                await this.discoverLikedGenreSongs();
                                await this.discoverTopSongsCountry();  
                            });
                        })
                        .catch(err => {
                            console.error(err);
                        });    
                    })
                    .catch(err => {
                        console.error(err);
                    });    
                });
            });
        })
        .catch(err => {
            console.error(err);
        });
    }

    handleFollow = (followedUser, thisUser = this.state.userDetails) => {
        let body = JSON.stringify({
            username: thisUser.username,
            followedUser: followedUser
        });
        
        fetch('http://localhost:4000/followUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
        .then(response => response.json())
        .then(response => {
            if (response.result === "success") {
                this.setState((state) => ({
                    followedUsers: [...state.followedUsers, followedUser]
                }), async () => {
                    console.log(this.state.followedUsers);
                    await this.getFollowedLikesSongs();
                });
            } else {
                window.alert(response.message);
            }
        })
        .catch(err => console.error(err));
    }

    handleRemoveFollow = (unfollowedUser, thisUser = this.state.userDetails) => {
        let body = JSON.stringify({
            username: thisUser.username,
            unfollowedUser: unfollowedUser
        });
        
        fetch('http://localhost:4000/removeFollowUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
        .then(response => response.json())
        .then(response => {
            if (response.result === "success") {
                this.setState((state) => ({
                    followedUsers: state.followedUsers.filter(name => name !== unfollowedUser)
                }), async () => {
                    console.log(this.state.followedUsers);
                    await this.getFollowedLikesSongs();
                });
            } else {
                window.alert(response.message);
            }
        })
        .catch(err => console.error(err));
    }
    
    handleSearch = (searchQuery) => {
        // const query = encodeURI(searchQuery);
        fetch(`http://localhost:4000/searchSongs/${searchQuery}`)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            this.setState({
                query: searchQuery,
                resultSongs: response.data
            }, () => {
                fetch(`http://localhost:4000/artistSongs/${searchQuery}`)
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    this.setState({
                        resultArtistSongs: response.data
                    }, async () => {
                        fetch(`http://localhost:4000/genreSongs/${searchQuery}`)
                        .then(response => response.json())
                        .then(response => {
                            console.log(response);
                            this.setState({
                                resultGenreSongs: response.data
                            }, async () => {                                
                                await this.getLikedSongs();
                                window.scrollTo(0,0);
                            });
                        })
                        .catch(err => {
                            console.error(err);
                        });            
                    });
                })
                .catch(err => {
                    console.error(err);
                });            
            });
        })
        .catch(err => {
            console.error(err);
        });    
    }
    
    handleLogout = () => {
        localStorage.removeItem('token');
        this.setState({
            userId: 'guest',
            userDetails: null,
            likedSongs: [],
            followedUsers: []
        }, async () => {
            await this.getQueueAndHistory();
            await this.getNowPlaying();    
        });
    }

    render() {
        return (
            <>
                <Navbar
                    userId={this.state.userId}
                    userDetails={this.state.userDetails}
                    handleLogout={this.handleLogout}
                    handleSearch={this.handleSearch}
                />
                <RegisterModal handleRegister={this.handleRegister} />
                <LoginModal handleLogin={this.handleLogin} />
                <div className="container pb-220">
                    <SearchResults
                        songs={this.state.songs}
                        likedSongs={this.state.likedSongs}
                        userDetails={this.state.userDetails}
                        handlePlay={this.handlePlay}
                        handleLike={this.handleLike}
                        handleRemoveLike={this.handleRemoveLike}  
                        resultSongs={this.state.resultSongs}
                        resultArtistSongs={this.state.resultArtistSongs}     
                        resultGenreSongs={this.state.resultGenreSongs}         
                        query={this.state.query}
                    />
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
                        queue={this.state.queue}
                        likedSongs={this.state.likedSongs}
                        userDetails={this.state.userDetails}
                        handlePlay={this.handlePlay}
                        handleLike={this.handleLike}
                        handleRemoveLike={this.handleRemoveLike}
                        handleAddToQueue={this.handleAddToQueue}
                    />
                    <SelectedGenreSongs 
                        selectedGenreSongs={this.state.selectedGenreSongs}
                        userDetails={this.state.userDetails}
                    />
                    <TrendingSongs
                        trendingSongs={this.state.trendingSongs}
                        userDetails={this.state.userDetails}
                        handlePlay={this.handlePlay}
                        handleLike={this.handleLike}
                        handleRemoveLike={this.handleRemoveLike}
                        likedSongs={this.state.likedSongs}
                    />
                    <TrendingArtists 
                        trendingArtists={this.state.trendingArtists}
                        userDetails={this.state.userDetails}
                        handleSearch={this.handleSearch}
                    />
                    <Discovery
                        likedArtistSongs={this.state.likedArtistSongs}
                        likedGenreSongs={this.state.likedGenreSongs}
                        topSongsCountry={this.state.topSongsCountry}
                        userDetails={this.state.userDetails}
                    />
                    <FollowedLikesSongs
                        followedLikesSongs={this.state.followedLikesSongs}
                        userDetails={this.state.userDetails}
                    />
                    <Users
                        users={this.state.users}
                        userDetails={this.state.userDetails}
                        followedUsers={this.state.followedUsers}
                        handleFollow={this.handleFollow}
                        handleRemoveFollow={this.handleRemoveFollow}
                    />
                </div>

                <NowPlaying
                    nowPlaying={this.state.nowPlaying}
                    queue={this.state.queue}
                    history={this.state.history}
                    handleSkip={this.handleSkip}
                    handlePrevious={this.handlePrevious}
                />
            </>
        );
    }
}

export default Main;