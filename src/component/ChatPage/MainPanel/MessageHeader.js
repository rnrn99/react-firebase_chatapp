import React from "react";
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
import { FaLock, FaRegHeart, FaSearch } from "react-icons/fa";

function MessageHeader() {
  return (
    <div
      style={{
        width: "100%",
        height: "170px",
        border: ".2rem solid #ececec",
        borderRadius: "1rem",
        marginBottom: "1rem",
        padding: "1rem",
      }}
    >
      <Container>
        <Row>
          <Col>
            <h2>
              <FaLock /> <FaRegHeart />
              ChatRoom Name
            </h2>
          </Col>
          <Col>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <FormControl placeholder="Search Messages" aria-label="search" />
            </InputGroup>
          </Col>
        </Row>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <p>
            <Image src="" /> user name
          </p>
        </div>
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
                  <Card.Body>body</Card.Body>
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
