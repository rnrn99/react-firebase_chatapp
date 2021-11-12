import React, { Component } from "react";
import MessageHeader from "./MessageHeader";
import Message from "./Message";
import MessageForm from "./MessageForm";
import { connect } from "react-redux";
import firebase from "../../../firebase";

export class MainPanel extends Component {
  state = {
    message: [],
    messageRef: firebase.database().ref("message"),
    messageLoading: true,
    searchTerm: "",
    searchResult: [],
    searchLoading: false,
  };

  componentDidMount() {
    const { chatRoom } = this.props;

    if (chatRoom) {
      this.addMessageListener(chatRoom.id);
    }
  }

  handleSearch = () => {
    const chatRoomMessage = [...this.state.message];
    const re = new RegExp(this.state.searchTerm, "gi");
    const searchResult = chatRoomMessage.reduce((acc, message) => {
      if (
        (message.content && message.content.match(re)) ||
        message.user.name.match(re)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResult: searchResult });
  };

  handleSearchChange = (event) => {
    this.setState(
      { searchTerm: event.target.value, searchLoading: true },
      () => {
        this.handleSearch();
      },
    );
  };

  addMessageListener = (chatRoomID) => {
    let arrMessage = [];
    this.state.messageRef
      .child(chatRoomID)
      .on("child_added", (DataSnapshot) => {
        arrMessage.push(DataSnapshot.val());
        this.setState({ message: arrMessage, messageLoading: false });
      });
  };

  renderMessage = (message) =>
    message.length > 0 &&
    message.map((m) => (
      <Message key={m.timestamp} message={m} user={this.props.user} />
    ));

  render() {
    const { message, searchTerm, searchResult } = this.state;
    return (
      <div style={{ padding: "2rem 2rem 0 2rem" }}>
        <MessageHeader handleSearchChange={this.handleSearchChange} />
        <div
          style={{
            width: "100%",
            height: "450px",
            border: ".2rem solid #ececec",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "1rem",
            overflowY: "auto",
          }}
        >
          {searchTerm
            ? this.renderMessage(searchResult)
            : this.renderMessage(message)}
        </div>
        <MessageForm />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  };
};

export default connect(mapStateToProps)(MainPanel);
