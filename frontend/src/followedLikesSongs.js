import React from 'react';

const FollowedLikesSongs = (props) => {
    console.log(props)
    let followedLikesSongs;
    if (props.userDetails && props.followedLikesSongs && props.followedLikesSongs.length > 0) {
        followedLikesSongs = props.followedLikesSongs.map(Song => 
            <li className="list-group-item list-group-item-action" key={Song}>
                {Song}
            </li>        
        );
    } 
    
    return (
        <> 
            {
                followedLikesSongs ? 
                <div className="py-3">
                    <h2>Top songs liked by your followed users</h2>
                    <ul className="list-group list-group-horizontal overflow-auto">
                        {followedLikesSongs}
                    </ul>
                </div>
                : null
            }
        </>
    );
}

export default FollowedLikesSongs;