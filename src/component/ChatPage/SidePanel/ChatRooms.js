import React, { Component } from "react";
import { AiOutlineSmile, AiOutlinePlus } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import firebase from "../../../firebase";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/action/chatroomAction";

export class ChatRooms extends Component {
  state = {
    show: false,
    name: "",
    description: "",
    chatRoomRef: firebase.database().ref("chatroom"),
    chatRoom: [],
    firstLoad: true,
    activeChatRoomId: "",
  };

  componentDidMount() {
    this.AddChatRoomListener();
  }

  componentWillUnmount() {
    this.state.chatRoomRef.off();
  }

  AddChatRoomListener = () => {
    let arrChatRoom = [];
    this.state.chatRoomRef.on("child_added", (DataSnapshot) => {
      arrChatRoom.push(DataSnapshot.val());
      this.setState({ chatRoom: arrChatRoom }, () => {
        this.setFirstChatRoom();
      });
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
    this.setState({ activeChatRoomId: room.id });
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
  };
};

export default connect(mapStateToProps)(ChatRooms);
