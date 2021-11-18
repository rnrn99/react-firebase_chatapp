import React, { Component } from "react";
import { AiOutlineSmile } from "react-icons/ai";
import firebase from "../../../firebase";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/action/chatroomAction";

export class Favorited extends Component {
  state = {
    userRef: firebase.database().ref("user"),
    favoritedChatRoom: [],
    activeChatRoomId: "",
  };

  componentDidMount() {
    if (this.props.user) {
      this.addFavoriteListener(this.props.user.uid);
    }
  }

  componentWillUnmount() {
    if (this.props.user) {
      this.removeListener(this.props.user.uid);
    }
  }

  addFavoriteListener = (userID) => {
    const { userRef } = this.state;
    userRef
      .child(userID)
      .child("favorited")
      .on("child_added", (snapshot) => {
        const favoritedChatRoom = { id: snapshot.key, ...snapshot.val() };
        this.setState({
          favoritedChatRoom: [
            ...this.state.favoritedChatRoom,
            favoritedChatRoom,
          ],
        });
      });

    userRef
      .child(userID)
      .child("favorited")
      .on("child_removed", (snapshot) => {
        const removedChatRoom = { id: snapshot.key, ...snapshot.val() };
        const filteredChatRoom = this.state.favoritedChatRoom.filter(
          (chatRoom) => {
            return chatRoom.id !== removedChatRoom.id;
          },
        );
        this.setState({
          favoritedChatRoom: filteredChatRoom,
        });
      });
  };

  removeListener = (userID) => {
    this.state.userRef.child(userID).child("favorited").off();
  };

  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: room.id });
  };

  renderFavoritedChatRoom = (favoritedChatRoom) =>
    favoritedChatRoom.length > 0 &&
    favoritedChatRoom.map((chatRoom) => (
      <li
        key={chatRoom.id}
        style={{
          backgroundColor:
            chatRoom.id === this.state.activeChatRoomId && "#ffffff45",
        }}
        onClick={() => this.changeChatRoom(chatRoom)}
      >
        # {chatRoom.name}
      </li>
    ));

  render() {
    const { favoritedChatRoom } = this.state;
    return (
      <div>
        <span style={{ display: "flex", alignItems: "center" }}>
          <AiOutlineSmile style={{ marginRight: 3 }} />
          FAVORITED ({favoritedChatRoom.length})
        </span>
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {this.renderFavoritedChatRoom(favoritedChatRoom)}
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

export default connect(mapStateToProps)(Favorited);
