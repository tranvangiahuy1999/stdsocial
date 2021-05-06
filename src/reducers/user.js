import {GET_USER, LOGOUT_USER} from '../constants/index'

const reducers = (state = {user: null}, action) => {
    switch(action.type){
        case GET_USER:
            return {...state, user: action.payload}
        case LOGOUT_USER:
            return {...state, user: null};
        default:
            return state;
    }
}

export default reducers