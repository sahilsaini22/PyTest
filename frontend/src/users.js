import React from 'react';

const Users = (props) => {
    if (props.userDetails) {
        let users = props.users.map(({_id, username, country}) => _id !== props.userDetails._id ?
            <li className="list-group-item list-group-item-action" key={_id}>
                {username} ({country})
                <button
                    type="button"
                    className={props.followedUsers.includes(username) ? "btn btn-primary btn-sm" : "btn btn-outline-primary btn-sm" }
                    onClick={() => {
                        props.followedUsers.includes(username) ? props.handleRemoveFollow(username) : props.handleFollow(username)
                    }}
                >
                    {props.followedUsers.includes(username) ? "followed" : "follow" }
                </button>
            </li>
            : null
        );

        return (
            <div className="py-3">
                <h2>Follow Users</h2>
                <ul className="list-group list-group-horizontal overflow-auto">
                    {users}
                </ul>
            </div>
        );    
    } else {
        return null;
    }
}

export default Users;