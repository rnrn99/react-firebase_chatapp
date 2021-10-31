import React from "react";
import { IoMdChatboxes } from "react-icons/io";
import { Dropdown, Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import firebase from "../../../firebase";

function UserPanel() {
  const user = useSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <div>
      <h3 style={{ color: "white", fontWeight: "bold" }}>
        <IoMdChatboxes /> Chat App
      </h3>

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <Image
          src={user && user.photoURL}
          style={{ width: "30px", height: "30px", marginTop: "3px" }}
          roundedCircle
        />
        <Dropdown>
          <Dropdown.Toggle
            id="dropdown-basic"
            style={{ background: "transparent", border: "0px" }}
          >
            {user && user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick>프로필 사진 변경</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default UserPanel;
