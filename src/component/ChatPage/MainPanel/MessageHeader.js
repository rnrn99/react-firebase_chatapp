import React, { useState, useEffect } from "react";
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
  Media,
} from "react-bootstrap";
import {
  FaLock,
  FaLockOpen,
  FaHeart,
  FaRegHeart,
  FaSearch,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../../../firebase";
import { setUserImage } from "../../../redux/action/chatroomAction";

function MessageHeader({ handleSearchChange }) {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const isPrivate = useSelector((state) => state.chatRoom.isPrivate);
  const user = useSelector((state) => state.user.currentUser);
  const userPost = useSelector((state) => state.chatRoom.userPost);
  const [isFavorited, setisFavorited] = useState(false);
  const userRef = firebase.database().ref("user");
  const dispatch = useDispatch();

  useEffect(() => {
    if (chatRoom && user) {
      addFavoriteListener(chatRoom.id, user.uid);
    }
  }, []);

  useEffect(() => {
    if (chatRoom && user) {
      if (
        !isPrivate &&
        user.displayName === chatRoom.createdBy.name &&
        user.photoURL !== chatRoom.createdBy.image
      ) {
        dispatch(setUserImage(user.photoURL));

        firebase
          .database()
          .ref("chatroom")
          .child(chatRoom.id)
          .child("createdBy")
          .update({ image: user.photoURL });
      }
    }
  }, [user]);

  const addFavoriteListener = (chatRoomID, userID) => {
    userRef
      .child(userID)
      .child("favorited")
      .once("value")
      .then((data) => {
        if (data.val() !== null) {
          const id = Object.keys(data.val());
          const isAlreadyFavorited = id.includes(chatRoomID);
          setisFavorited(isAlreadyFavorited);
        }
      });
  };

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

  const renderUserPost = (userPost) =>
    Object.entries(userPost)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, val], i) => (
        <Media key={i}>
          <img
            style={{ borderRadius: 25 }}
            width={32}
            height={32}
            src={val.image}
            alt={val.name}
          />
          <Media.Body>
            <h6 style={{ display: "inline" }}>{key}</h6>
            <p style={{ float: "right" }}>{val.count}개</p>
          </Media.Body>
        </Media>
      ));

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
        {!isPrivate && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <Image
              src={chatRoom && chatRoom.createdBy.image}
              style={{ width: "20px", height: "20px", marginTop: "3px" }}
              roundedCircle
            />
            {chatRoom && chatRoom.createdBy.name}
          </div>
        )}

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
                  <Card.Body>{userPost && renderUserPost(userPost)}</Card.Body>
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
