import React, { useRef } from "react";
import { IoMdChatboxes } from "react-icons/io";
import { Dropdown, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import mime from "mime-types";
import { setPhotoURL } from "../../../redux/action/userAction";

function UserPanel() {
  const user = useSelector((state) => state.user.currentUser);
  const inputOpenImageRef = useRef();
  const dispatch = useDispatch();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {})
      .catch((error) => {});
  };

  const handleOpenUploadPanel = () => {
    inputOpenImageRef.current.click();
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];
    const metadata = { contentType: mime.lookup(file.name) };
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      // firebase storage에 이미지 저장
      let uploadTask = uploadBytesResumable(
        storageRef(getStorage(), `user_image/${user.uid}`),
        file,
        metadata,
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // 프로필 이미지 수정
            updateProfile(user, {
              photoURL: downloadURL,
            });

            // redux에서 photoURL 변경
            dispatch(setPhotoURL(downloadURL));

            // firebase DB에서 user image 수정
            update(ref(getDatabase(), `user/${user.uid}`), {
              image: downloadURL,
            });
          });
        },
      );
    } catch (error) {
      console.log(error.message);
    }
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
            <Dropdown.Item onClick={handleOpenUploadPanel}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <input
        type="file"
        accept="image/jpeg, image/png"
        ref={inputOpenImageRef}
        style={{ display: "none" }}
        onChange={handleUploadImage}
      />
    </div>
  );
}

export default UserPanel;
