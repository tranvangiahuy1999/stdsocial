import {
  LOGIN_TOKEN,
  LOGOUT,
  GET_USER,
  GET_SELECTED_CHAT,
} from "../constants/index";

const reducers = (state = { token: "", user: null, chat: null }, action) => {
  switch (action.type) {
    case LOGIN_TOKEN:
      return { ...state, token: action.payload };
    case LOGOUT:
      return { ...state, token: "" };
    case GET_USER:
      return { ...state, user: action.payload };
    case GET_SELECTED_CHAT:
      return { ...state, chat: action.payload };
    default:
      return state;
  }
};

export default reducers;
