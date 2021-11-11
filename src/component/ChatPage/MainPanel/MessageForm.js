import React, { useState, useRef } from "react";
import { Form, ProgressBar, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import mime from "mime-types";
import firebase from "../../../firebase";

function MessageForm() {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);

  const [Content, setContent] = useState("");
  const [Loading, setLoading] = useState(false);
  const [Percentage, setPercentage] = useState(0);

  const messageRef = firebase.database().ref("message");
  const storageRef = firebase.storage().ref();
  const inputOpenImageRef = useRef();

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    const filePath = `/message/public/${file.name}`;
    const metadata = { contentType: mime.lookup(file.name) };

    let uploadTask = storageRef.child(filePath).put(file, metadata);

    uploadTask.on("state_changed", (UploadSnapshot) => {
      const percent = Math.round(
        (UploadSnapshot.bytesTransferred / UploadSnapshot.totalBytes) * 100,
      );
      setPercentage(percent);
    });
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

      {!(Percentage === 0 || Percentage === 100) && (
        <ProgressBar animated now={Percentage} />
      )}

      <Row>
        <Col>
          <button
            className="message-form-button"
            style={{ width: "100%" }}
            onClick={handleOpenImageRef}
          >
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

      <input
        style={{ display: "none" }}
        type="file"
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  );
}

export default MessageForm;
