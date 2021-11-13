import React, { Component } from "react";
import { AiOutlineSmile } from "react-icons/ai";
import { connect } from "react-redux";
import firebase from "../../../firebase";

export class DirectMessage extends Component {
  state = {
    userRef: firebase.database().ref("user"),
    user: [],
  };

  componentDidMount() {
    if (this.props.user) {
      this.addUserListener();
    }
  }

  addUserListener = () => {
    let arrUser = [];
    this.state.userRef.on("child_added", (snapshot) => {
      if (this.props.user.uid !== snapshot.key) {
        let userInfo = snapshot.val();
        userInfo["uid"] = snapshot.key;
        userInfo["status"] = "offline";
        arrUser.push(userInfo);
        this.setState({ user: arrUser });
      }
    });
  };

  renderDM = () => {};

  render() {
    return (
      <div>
        <span style={{ display: "flex", alignItems: "center" }}>
          <AiOutlineSmile style={{ marginRight: 3 }} /> DM ({})
        </span>

        <ul style={{ listStyleType: "none", padding: 0 }}>{this.renderDM()}</ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(DirectMessage);
