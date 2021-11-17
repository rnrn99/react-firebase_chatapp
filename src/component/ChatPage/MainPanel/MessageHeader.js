import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Image,
  Accordion,
  Card,
  Button,
} from "react-bootstrap";
import {
  FaLock,
  FaLockOpen,
  FaHeart,
  FaRegHeart,
  FaSearch,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import firebase from "../../../firebase";

function MessageHeader({ handleSearchChange }) {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const isPrivate = useSelector((state) => state.chatRoom.isPrivate);
  const user = useSelector((state) => state.user.currentUser);
  const [isFavorited, setisFavorited] = useState(false);
  const userRef = firebase.database().ref("user");

  const handleFavorite = () => {
    if (isFavorited) {
      userRef
        .child(`${user.uid}/favorited`)
        .child(chatRoom.id)
        .remove((err) => {
          if (err !== null) console.log(err.message);
        });
      setisFavorited((prev) => !prev);
    } else {
      userRef.child(`${user.uid}/favorited`).update({
        [chatRoom.id]: {
          name: chatRoom.name,
          description: chatRoom.description,
          createdBy: {
            name: chatRoom.createdBy.name,
            image: chatRoom.createdBy.image,
          },
        },
      });
      setisFavorited((prev) => !prev);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        border: ".2rem solid #ececec",
        borderRadius: "1rem",
        marginBottom: "1rem",
        padding: "1rem",
        overflow: "hidden",
      }}
    >
      <Container>
        <Row>
          <Col>
            <h2>{chatRoom && chatRoom.name}</h2>
            {isPrivate ? <FaLock /> : <FaLockOpen />}
            {!isPrivate && (
              <span style={{ cursor: "pointer" }} onClick={handleFavorite}>
                {isFavorited ? <FaHeart /> : <FaRegHeart />}
              </span>
            )}
          </Col>
          <Col>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <FormControl
                placeholder="Search Messages"
                aria-label="search"
                onChange={handleSearchChange}
              />
            </InputGroup>
          </Col>
        </Row>
        <div style={{ display: "flex", justifyContent: "flex-end" }}></div>
        <Row>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: "0 1rem" }}>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Description
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>{chatRoom && chatRoom.description}</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: "0 1rem" }}>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Posts Count
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>body</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MessageHeader;
