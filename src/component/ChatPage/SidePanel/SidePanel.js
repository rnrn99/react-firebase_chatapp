import React from "react";
import UserPanel from "./UserPanel";
import Favorited from "./Favorited";
import ChatRooms from "./ChatRooms";
import DirectMessage from "./DirectMessage";

function SidePanel(props) {
  return (
    <div
      style={{
        backgroundColor: "#7B83EB",
        padding: "2rem",
        minWidth: "275px",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <UserPanel currentUser={props.currentUser} />
      <Favorited currentUser={props.currentUser} />
      <ChatRooms />
      <DirectMessage currentUser={props.currentUser} />
    </div>
  );
}

export default SidePanel;
