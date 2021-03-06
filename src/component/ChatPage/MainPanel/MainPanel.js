import React, { Component } from "react";
import MessageHeader from "./MessageHeader";
import Message from "./Message";
import MessageForm from "./MessageForm";
import Skeleton from "../../../common/Skeleton";
import { connect } from "react-redux";
import {
  getDatabase,
  ref,
  child,
  off,
  onChildAdded,
  onChildRemoved,
} from "firebase/database";
import { setUserPost } from "../../../redux/action/chatroomAction";

export class MainPanel extends Component {
  messageEndRef = React.createRef();

  state = {
    message: [],
    messageRef: ref(getDatabase(), "message"),
    messageLoading: true,
    searchTerm: "",
    searchResult: [],
    searchLoading: false,
    typingRef: ref(getDatabase(), "typing"),
    typingUser: [],
    listenerList: [],
  };

  componentDidMount() {
    const { chatRoom } = this.props;

    if (chatRoom) {
      this.addMessageListener(chatRoom.id);
      this.addTypingListener(chatRoom.id);
    }
  }

  componentDidUpdate() {
    if (this.messageEndRef) {
      this.messageEndRef.scrollIntoView({ behavior: "smooth" });
    }
  }

  componentWillUnmount() {
    this.removeListener(this.state.listenerList);
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
    onChildAdded(child(this.state.messageRef, chatRoomID), (DataSnapshot) => {
      arrMessage.push(DataSnapshot.val());
      this.setState({ message: arrMessage, messageLoading: false });
      this.userPostCount(arrMessage);
    });
    this.addToListenerList(chatRoomID, this.state.messageRef, "child_added");
  };

  addTypingListener = (chatRoomID) => {
    let arrTyping = [];
    onChildAdded(child(this.state.typingRef, chatRoomID), (snapshot) => {
      if (snapshot.key !== this.props.user.uid) {
        arrTyping = arrTyping.concat({
          id: snapshot.key,
          name: snapshot.val(),
        });
        this.setState({ typingUser: arrTyping });
      }
    });
    this.addToListenerList(chatRoomID, this.state.typingRef, "child_added");

    onChildRemoved(child(this.state.typingRef, chatRoomID), (snapshot) => {
      const index = arrTyping.findIndex((user) => user.id === snapshot.key);
      if (index !== -1) {
        arrTyping = arrTyping.filter((user) => user.id !== snapshot.key);
        this.setState({ typingUser: arrTyping });
      }
    });
    this.addToListenerList(chatRoomID, this.state.typingRef, "child_removed");
  };

  addToListenerList = (id, ref, event) => {
    const index = this.state.listenerList.findIndex((listener) => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({
        listenerList: this.state.listenerList.concat(newListener),
      });
    }
  };

  removeListener = (listenerList) => {
    listenerList.forEach((listener) => {
      off(ref(getDatabase(), `message/${listener.id}`), listener.event);
    });
  };

  userPostCount = (messages) => {
    let userPost = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          image: message.user.image,
          count: 1,
        };
      }
      return acc;
    }, {});
    this.props.dispatch(setUserPost(userPost));
  };

  renderMessage = (message) =>
    message.length > 0 &&
    message.map((m) => (
      <Message key={m.timestamp} message={m} user={this.props.user} />
    ));

  renderTyping = (typingUser) =>
    typingUser.length > 0 &&
    typingUser.map((user) => (
      <span>{user.name}?????? ????????? ???????????? ????????????...</span>
    ));

  renderSkeleton = (loading) =>
    loading && (
      <>
        {[...Array(10)].map((item, i) => (
          <Skeleton key={i} />
        ))}
      </>
    );

  render() {
    const { message, searchTerm, searchResult, typingUser, messageLoading } =
      this.state;
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
          {this.renderSkeleton(messageLoading)}

          {searchTerm
            ? this.renderMessage(searchResult)
            : this.renderMessage(message)}

          {this.renderTyping(typingUser)}

          <div ref={(node) => (this.messageEndRef = node)} />
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
