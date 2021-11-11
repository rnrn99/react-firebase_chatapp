import React from "react";
import moment from "moment";
import Media from "react-bootstrap/Media";

function Message({ message, user }) {
  const setTime = (timestamp) => moment(timestamp).fromNow();
  const isImage = (message) => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };
  const isMine = (message, user) => {
    if (message && user) {
      return message.user.id === user.uid;
    }
  };

  return (
    <div>
      <Media
        style={{
          marginBottom: "3px",
          width: "50%",
          marginLeft: isMine(message, user) && "auto",
        }}
      >
        <img
          style={{ borderRadius: "10px" }}
          width={35}
          height={35}
          src={message.user.image}
          alt={message.user.name}
        />
        <Media.Body
          style={{
            backgroundColor: isMine(message, user) ? "#dce4f0" : "#ECECEC",
          }}
        >
          <h6>
            {message.user.name}
            <span
              style={{ fontSize: "10px", color: "gray", marginLeft: "5px" }}
            >
              {setTime(message.timestamp)}
            </span>
          </h6>
          {isImage(message) ? (
            <img
              style={{ maxWidth: "250px" }}
              alt="_image"
              src={message.image}
            />
          ) : (
            <p>{message.content}</p>
          )}
        </Media.Body>
      </Media>
    </div>
  );
}

export default Message;
