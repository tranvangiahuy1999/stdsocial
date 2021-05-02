import {LOGIN_TOKEN} from '../constants/index'

export const getToken = (token) => (
    {
        type: LOGIN_TOKEN,
        payload: token
    }
)
