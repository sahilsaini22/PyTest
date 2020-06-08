import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Songs from './songs.js';
import TrendingSongs from './trendingSongs.js';
import NowPlaying from './nowPlaying.js';

class Tracks extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;
        // var userp = null;
        // user ?
        // user.user.role === 'user' ?  userp = (<Userpage />) : userp = (<Adminpage />)
        // :
        // userp = (<Userpage />);        
        
        // return (
        //     <>                
        //         {userp}                
        //     </>
        // );
        return(
            <>
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
                        songs={this.props.songs}
                        handlePlay={this.props.handlePlay}
                    />
                    <TrendingSongs trendingSongs={this.props.trendingSongs} />
                </div>
                <NowPlaying
                    nowPlaying={this.props.nowPlaying}
                    queue={this.props.queue}
                />            
            </>
        );
    }
}

Tracks.propTypes = {
   
}

const mapStateToProps = (state) => ({    
    auth: state.auth
});

export default connect(mapStateToProps, {  })(Tracks);