import {
  SET_CURRENT_CHAT_ROOM,
  SET_PRIVATE_CHAT_ROOM,
  SET_USER_POST,
  SET_USER_IMAGE,
} from "./types";

export function setCurrentChatRoom(currentChatRoom) {
  return {
    type: SET_CURRENT_CHAT_ROOM,
    payload: currentChatRoom,
  };
}

export function setPrivateChatRoom(isPrivateChatRoom) {
  return {
    type: SET_PRIVATE_CHAT_ROOM,
    payload: isPrivateChatRoom,
  };
}

export function setUserPost(userPost) {
  return {
    type: SET_USER_POST,
    payload: userPost,
  };
}

export function setUserImage(userImage) {
  return {
    type: SET_USER_IMAGE,
    payload: userImage,
  };
}
