import React, { useState } from "react";
import { Form, ProgressBar, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import firebase from "../../../firebase";

function MessageForm() {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);

  const [Content, setContent] = useState("");
  const [Loading, setLoading] = useState(false);
  const messageRef = firebase.database().ref("message");

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
    };

    if (fileUrl !== null) {
      // 파일 전송
      message["image"] = fileUrl;
    } else {
      // 메세지 전송
      message["content"] = Content;
    }

    return message;
  };
  const handleSubmit = async () => {
    if (!Content) {
      alert("Type contents first");
      return;
    }
    setLoading(true);

    try {
      await messageRef.child(chatRoom.id).push().set(createMessage());
      setLoading(false);
      setContent("");
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control
            as="textarea"
            rows={3}
            value={Content}
            onChange={handleChange}
          />
        </Form.Group>
      </Form>

      <ProgressBar animated label="" now={60} />

      <Row>
        <Col>
          <button className="message-form-button" style={{ width: "100%" }}>
            UPLOAD
          </button>
        </Col>
        <Col>
          <button
            className="message-form-button"
            style={{ width: "100%" }}
            onClick={handleSubmit}
          >
            SEND
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default MessageForm;
