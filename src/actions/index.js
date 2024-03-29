import { LOGIN_TOKEN, GET_USER, GET_SELECTED_CHAT } from "../constants/index";

export const getToken = (token) => ({
  type: LOGIN_TOKEN,
  payload: token,
});

export const getUser = (user) => ({
  type: GET_USER,
  payload: user,
});

export const getSelectedChat = (chat) => ({
  type: GET_SELECTED_CHAT,
  payload: chat,
});
