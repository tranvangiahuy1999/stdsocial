import {LOGIN_TOKEN, LOGOUT} from '../constants/index'

const reducers = (state = {token: ''}, action) => {
    switch(action.type){
        case LOGIN_TOKEN:
            return {...state, token: action.payload}
        case LOGOUT:
            return {...state, token: ''};
        default:
            return state;
    }
}

export default reducers