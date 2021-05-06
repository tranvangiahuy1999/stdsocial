import {LOGIN_TOKEN, GET_USER} from '../constants/index'

export const getToken = (token) => (
    {
        type: LOGIN_TOKEN,
        payload: token
    }
)

export const getUser = (user) => (
    {
        type: GET_USER,
        payload: user
    }
)
