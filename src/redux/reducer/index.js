import { combineReducers } from "redux";
import user from "./userReducer";
import chatRoom from "./chatroomReducer";

const rootReducer = combineReducers({
  user,
  chatRoom,
});

export default rootReducer;
