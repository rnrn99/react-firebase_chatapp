import { SET_USER } from "../action/types";

const initialUserState = {
  currentUser: null,
  isLoading: true,
};

export default function userReducer(state = initialUserState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}
