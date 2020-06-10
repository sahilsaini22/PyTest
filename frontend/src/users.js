import React from 'react';

const Users = (props) => {
    let users = props.users.map(({_id, username, country}) => _id !== props.userDetails._id ?
        <li className="list-group-item list-group-item-action" key={_id}>
            {username} ({country})
            <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {props.handleFollow(_id)}}
            >
                follow
            </button>
        </li>
        : null
    );
    
    if (props.userDetails) {
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