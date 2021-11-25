import React, { useState, useRef } from "react";
import { Form, ProgressBar, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import mime from "mime-types";
import { getDatabase, ref, child, set, remove, push } from "firebase/database";
import {
  getStorage,
  ref as storageref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function MessageForm() {
  const user = useSelector((state) => state.user.currentUser);
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const isPrivate = useSelector((state) => state.chatRoom.isPrivate);

  const [Content, setContent] = useState("");
  const [Loading, setLoading] = useState(false);
  const [Percentage, setPercentage] = useState(0);

  const messageRef = ref(getDatabase(), "message");
  const typingRef = ref(getDatabase(), "typing");
  const inputOpenImageRef = useRef();

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const getPath = () => {
    if (isPrivate) {
      return `/message/private/${chatRoom.id}`;
    }
    return "/message/public";
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    const filePath = `${getPath()}/${file.name}`;
    const metadata = { contentType: mime.lookup(file.name) };
    const storage = getStorage();
    setLoading(true);

    try {
      const storageRef = storageref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (UploadSnapshot) => {
          const percent = Math.round(
            (UploadSnapshot.bytesTransferred / UploadSnapshot.totalBytes) * 100,
          );
          setPercentage(percent);
        },
        (err) => {
          alert(err.message);
          setLoading(false);
        },
        () => {
          // storage에 file 저장 후 database에 message 저장
          getDownloadURL(uploadTask.snapshot.ref).then((fileUrl) => {
            set(push(child(messageRef, chatRoom.id)), createMessage(fileUrl));
            setLoading(false);
          });
        },
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.keyCode === 13) {
      handleSubmit();
    }

    if (Content) {
      set(child(typingRef, `${chatRoom.id}/${user.uid}`), user.displayName);
    } else {
      remove(child(typingRef, `${chatRoom.id}/${user.uid}`));
    }
  };

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: new Date(),
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
      await set(push(child(messageRef, chatRoom.id)), createMessage());
      await remove(child(typingRef, `${chatRoom.id}/${user.uid}`));
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
            onKeyDown={handleKeyDown}
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
            disabled={Loading ? true : false}
          >
            UPLOAD
          </button>
        </Col>
        <Col>
          <button
            className="message-form-button"
            style={{ width: "100%" }}
            onClick={handleSubmit}
            disabled={Loading ? true : false}
          >
            SEND
          </button>
        </Col>
      </Row>

      <input
        accept="image/jpeg, image/png"
        style={{ display: "none" }}
        type="file"
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  );
}

export default MessageForm;
