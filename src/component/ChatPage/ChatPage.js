import React from "react";
import { useSelector } from "react-redux";
import MainPanel from "./MainPanel/MainPanel";
import SidePanel from "./SidePanel/SidePanel";

function ChatPage() {
  const user = useSelector((state) => state.user.currentUser);
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "300px" }}>
        <SidePanel key={user && user.uid} />
      </div>
      <div style={{ width: "100%" }}>
        <MainPanel key={chatRoom && chatRoom.id} />
      </div>
    </div>
  );
}

export default ChatPage;
