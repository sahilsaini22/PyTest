import axios from 'axios';
import {
USER_LOADING,
USER_LOADED,
AUTH_ERROR,
LOGIN_SUCCESS,
LOGIN_FAIL,
LOGOUT_SUCCESS,
REGISTER_SUCCESS,
REGISTER_FAIL,
GET_USERS,
} from "./types";
import { returnErrors } from './errorActions';


//check token and load user

export const loadUser = () => ( dispatch, getState ) => {
    dispatch({type: USER_LOADING});
    axios.get('http://localhost:4000/auth/users', tokenConfig(getState))
    .then(res => dispatch({
        type: USER_LOADED, 
        payload: res.data
    })) 
    .catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: AUTH_ERROR
        });
    })
}

//Register User
export const register = ({ username, password, role, country}) => dispatch => {
  
    // Headers
    const config = {
    headers: {
        'Content-Type': 'application/json'
    }
    };
  
    // Request body
    const body = JSON.stringify({ username, password, role, country });
  
    axios
    .post('http://localhost:4000/auth/register', body, config)
    .then(res =>
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
    )
    .catch(err => {
        dispatch(
            returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
        );
        dispatch({
            type: REGISTER_FAIL
        });
    });
  };
  
/*
export const register = ({ username, password}) => dispatch => {
    //headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
      
    //Request Data
    const body = JSON.stringify({ username, password });

    axios.post('http://localhost:4000/api/auth/register', body, config) 
    .then(res => dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
    }))
    .catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
        dispatch({
            type: REGISTER_FAIL         
        }) 
    })
}
*/

//Get User List
export const allUsers = () => ( dispatch ) => {    
    axios.get('http://localhost:4000/users')
    .then(res => dispatch({            
        type: GET_USERS,
        payload: res.data
    })) 
    .catch(err => {
        //dispatch(returnErrors(err.response.data, err.response.status));         
    })
}

//Login User
export const login = ({ username, password }) => dispatch => {
    //headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ username, password });

    axios.post('http://localhost:4000/auth/login', body, config) 
    .then(res => dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
    }))
    .catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
        dispatch({
            type: LOGIN_FAIL         
        }) 
    })
}


//Logout User
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    }
}

//Setup config/headers in token
export const tokenConfig = getState => {
    //get token 
    const  token = getState().auth.token;

    //Headers
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }


    //If token, add to headers
    if(token) {
        config.headers['x-auth-token'] = token;         
    }
    return config;
}