import {
  SET_CURRENT_CHAT_ROOM,
  SET_PRIVATE_CHAT_ROOM,
  SET_USER_POST,
} from "../action/types";

const initialChatRoomState = {
  currentChatRoom: null,
  isPrivate: false,
  userPost: null,
};

export default function userReducer(state = initialChatRoomState, action) {
  switch (action.type) {
    case SET_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentChatRoom: action.payload,
      };
    case SET_PRIVATE_CHAT_ROOM:
      return {
        ...state,
        isPrivate: action.payload,
      };
    case SET_USER_POST:
      return {
        ...state,
        userPost: action.payload,
      };
    default:
      return state;
  }
}
