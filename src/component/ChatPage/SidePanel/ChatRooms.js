import React, { Component } from "react";
import { AiOutlineSmile, AiOutlinePlus } from "react-icons/ai";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import { connect } from "react-redux";
import firebase from "../../../firebase";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
  setUserPost,
} from "../../../redux/action/chatroomAction";

export class ChatRooms extends Component {
  state = {
    show: false,
    name: "",
    description: "",
    chatRoomRef: firebase.database().ref("chatroom"),
    messageRef: firebase.database().ref("message"),
    chatRoom: [],
    firstLoad: true,
    activeChatRoomId: "",
    notifications: [],
  };

  componentDidMount() {
    this.AddChatRoomListener();
  }

  componentWillUnmount() {
    this.state.chatRoomRef.off();
    this.state.chatRoom.forEach((room) => {
      this.state.messageRef.child(room.id).off();
    });
  }

  AddChatRoomListener = () => {
    let arrChatRoom = [];
    this.state.chatRoomRef.on("child_added", (DataSnapshot) => {
      arrChatRoom.push(DataSnapshot.val());
      this.setState({ chatRoom: arrChatRoom }, () => this.setFirstChatRoom());
      this.addNotificationListener(DataSnapshot.key);
    });
  };

  addNotificationListener = (chatRoomID) => {
    this.state.messageRef.child(chatRoomID).on("value", (snapshot) => {
      if (this.props.chatRoom) {
        this.handleNotification(
          chatRoomID,
          this.props.chatRoom.id,
          this.state.notifications,
          snapshot,
        );
      }
    });
  };

  setFirstChatRoom = () => {
    const firstChatRoom = this.state.chatRoom[0];
    if (this.state.firstLoad && this.state.chatRoom.length > 0) {
      this.props.dispatch(setCurrentChatRoom(firstChatRoom));
      this.setState({ activeChatRoomId: firstChatRoom.id });
    }
    this.setState({ firstLoad: false });
  };

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  handleSubmit = (e) => {
    e.preventDefault();

    const { name, description } = this.state;

    if (this.isFormValid(name, description)) {
      this.addChatRoom();
    }
  };

  handleNotification = (
    chatRoomID,
    currentChatRoomID,
    notifications,
    snapshot,
  ) => {
    let index = notifications.findIndex(
      (notification) => notification.id === chatRoomID,
    );

    if (index === -1) {
      // notifications state 안에 해당 채팅방의 알림 정보가 없을 때
      notifications.push({
        id: chatRoomID,
        total: snapshot.numChildren(),
        lastKnownTotal: snapshot.numChildren(),
        count: 0,
      });
    } else {
      // 이미 해당 채팅방의 알림 정보가 있을 때
      if (chatRoomID !== currentChatRoomID) {
        if (snapshot.numChildren() - notifications[index].lastKnownTotal > 0) {
          notifications[index].count =
            snapshot.numChildren() - notifications[index].lastKnownTotal;
        }
      }
      notifications[index].total = snapshot.numChildren();
    }

    this.setState({ notifications });
  };

  getNotificationCount = (chatRoom) => {
    let count = 0;

    this.state.notifications.forEach((notification) => {
      if (notification.id === chatRoom.id) {
        count = notification.count;
      }
    });
    if (count > 0) return count;
  };

  clearNotification = () => {
    let index = this.state.notifications.findIndex(
      (notification) => notification.id === this.props.chatRoom.id,
    );

    if (index !== -1) {
      let updatedNotification = [...this.state.notifications];
      updatedNotification[index].lastKnownTotal =
        this.state.notifications[index].total;
      updatedNotification[index].count = 0;
      this.setState({ notifications: updatedNotification });
    }
  };

  isFormValid = (name, description) => name && description;

  addChatRoom = async () => {
    const key = this.state.chatRoomRef.push().key;
    const { name, description } = this.state;
    const { user } = this.props;
    const newRoom = {
      id: key,
      name: name,
      description: description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
    };

    try {
      await this.state.chatRoomRef.child(key).update(newRoom);
      this.setState({
        name: "",
        description: "",
        show: false,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    this.props.dispatch(setUserPost(null));
    this.setState({ activeChatRoomId: room.id });
    this.clearNotification();
  };

  renderChatRoom = (chatRoom) =>
    chatRoom.length > 0 &&
    chatRoom.map((room) => (
      <li
        key={room.id}
        style={{
          backgroundColor:
            room.id === this.state.activeChatRoomId && "#ffffff45",
          cursor: "pointer",
        }}
        onClick={() => this.changeChatRoom(room)}
      >
        # {room.name}
        <Badge style={{ float: "right", marginTop: "4px" }} variant="danger">
          {this.getNotificationCount(room)}
        </Badge>
      </li>
    ));

  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            position: "relative",
            alignItems: "center",
            width: "100%",
          }}
        >
          <AiOutlineSmile style={{ marginRight: 3 }} />
          CHAT ROOMS ({this.state.chatRoom.length})
          <AiOutlinePlus
            onClick={this.handleShow}
            style={{ position: "absolute", right: 0, cursor: "pointer" }}
          />
        </div>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {this.renderChatRoom(this.state.chatRoom)}
        </ul>

        {/* MODAL */}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Chat Room</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the name of the chat room"
                  onChange={(e) => this.setState({ name: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the description of the chat room"
                  onChange={(e) =>
                    this.setState({ description: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>
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

export default connect(mapStateToProps)(ChatRooms);
