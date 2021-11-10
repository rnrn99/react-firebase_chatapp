import React from "react";
import { Form, ProgressBar, Row, Col } from "react-bootstrap";

function MessageForm() {
  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
      </Form>

      <ProgressBar animated label="" now={60} />

      <Row>
        <Col>
          <button className="message-form-button" style={{ width: "100%" }}>
            SEND
          </button>
        </Col>
        <Col>
          <button className="message-form-button" style={{ width: "100%" }}>
            UPLOAD
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default MessageForm;
