import React, { Component } from "react";
import { AiOutlineSmile } from "react-icons/ai";
import { connect } from "react-redux";
import { getDatabase, ref, child, onChildAdded } from "firebase/database";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
  setUserPost,
} from "../../../redux/action/chatroomAction";

export class DirectMessage extends Component {
  state = {
    userRef: ref(getDatabase(), "user"),
    user: [],
    activeChatRoom: "",
  };

  componentDidMount() {
    if (this.props.user) {
      this.addUserListener();
    }
  }

  addUserListener = () => {
    let arrUser = [];
    onChildAdded(this.state.userRef, (snapshot) => {
      if (this.props.user.uid !== snapshot.key) {
        let userInfo = snapshot.val();
        userInfo["uid"] = snapshot.key;
        userInfo["status"] = "offline";
        arrUser.push(userInfo);
        this.setState({ user: arrUser });
      }
    });
  };

  setActiveChatRoom = (userID) => {
    this.setState({ activeChatRoom: userID });
  };

  changeChatRoom = (user) => {
    const chatRoomID = this.getChatRoomID(user.uid);
    const chatRoomData = {
      id: chatRoomID,
      name: user.name,
    };

    this.props.dispatch(setCurrentChatRoom(chatRoomData));
    this.props.dispatch(setPrivateChatRoom(true));
    this.props.dispatch(setUserPost(null));
    this.setActiveChatRoom(user.uid);
  };

  getChatRoomID = (userID) => {
    const currentUserID = this.props.user.uid;

    return userID > currentUserID
      ? `${userID}/${currentUserID}`
      : `${currentUserID}/${userID}`;
  };

  renderDM = (user) =>
    user.length > 0 &&
    user.map((u) => (
      <li
        key={u.uid}
        style={{
          backgroundColor: u.uid === this.state.activeChatRoom && "#ffffff45",
        }}
        onClick={() => this.changeChatRoom(u)}
      >
        # {u.name}
      </li>
    ));

  render() {
    const { user } = this.state;
    return (
      <div>
        <span style={{ display: "flex", alignItems: "center" }}>
          <AiOutlineSmile style={{ marginRight: 3 }} /> DM ({user.length})
        </span>

        <ul style={{ listStyleType: "none", padding: 0 }}>
          {this.renderDM(user)}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(DirectMessage);
