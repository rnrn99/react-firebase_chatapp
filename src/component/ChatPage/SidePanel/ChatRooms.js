import React, { Component } from "react";
import { AiOutlineSmile, AiOutlinePlus } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export class ChatRooms extends Component {
  state = {
    show: false,
  };

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

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
          CHAT ROOMS ({})
          <AiOutlinePlus
            onClick={this.handleShow}
            style={{ position: "absolute", right: 0, cursor: "pointer" }}
          />
        </div>

        {/* MODAL */}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Chat Room</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the name of the chat room"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the description of the chat room"
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ChatRooms;
